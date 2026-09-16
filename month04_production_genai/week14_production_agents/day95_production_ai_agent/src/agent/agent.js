import { createAgentState, completeState, failState } from "./state.js";
import { plan, validatePlan } from "./planner.js";
import { executeTool } from "./executor.js";
import { generateFinalAnswer } from "./llm.js";
import { createMemory, addMessage, getMessages } from "../memory/memory.js";
import {
  createTrace,
  startSpan,
  endSpan,
  finishTrace
} from "../observability/trace.js";
import { logEvent } from "../observability/logger.js";
import {
  recordRequest,
  recordToolCall,
  recordLlmCall
} from "../observability/metrics.js";
import { classifyError, publicErrorMessage } from "../observability/errors.js";

async function retry(operation, attempts = 3, shouldRetry = () => true) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !shouldRetry(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** (attempt - 1)));
    }
  }

  throw lastError;
}

function isRetryable(error) {
  const text = String(error?.message || "").toLowerCase();
  return (
    text.includes("timeout") ||
    text.includes("rate limit") ||
    text.includes("network") ||
    text.includes("temporarily")
  );
}

export async function runAgent({
  input,
  role = "user",
  customerId = "CUST-001",
  sessionId = "default"
}) {
  if (!input || typeof input !== "string" || input.trim().length === 0) {
    throw new Error("Message is required");
  }

  const state = createAgentState({
    input: input.trim(),
    role,
    customerId,
    sessionId
  });

  const trace = createTrace();
  state.traceId = trace.traceId;

  const memory = createMemory(sessionId);
  addMessage(memory, { role: "user", content: state.input });

  logEvent("agent_started", {
    traceId: trace.traceId,
    sessionId,
    role
  });

  try {
    const plannerSpan = startSpan(trace, "planner");
    const agentPlan = plan(state.input);
    validatePlan(agentPlan);
    state.plan = agentPlan;
    endSpan(plannerSpan, "success", {
      agent: agentPlan.agent,
      tool: agentPlan.tool
    });

    const toolSpan = startSpan(trace, `tool.${agentPlan.tool}`, {
      tool: agentPlan.tool
    });

    const toolStarted = Date.now();
    let result;

    try {
      result = await retry(
        () =>
          executeTool({
            toolName: agentPlan.tool,
            args: agentPlan.args,
            role,
            customerId
          }),
        3,
        isRetryable
      );

      state.results.push(result);
      state.toolCalls.push({
        tool: agentPlan.tool,
        args: agentPlan.args,
        status: "success",
        durationMs: Date.now() - toolStarted
      });

      recordToolCall({ success: true });
      endSpan(toolSpan, "success", {
        durationMs: Date.now() - toolStarted
      });
    } catch (error) {
      recordToolCall({ success: false });
      endSpan(toolSpan, "error", {
        errorType: classifyError(error)
      });
      throw error;
    }

    const llmSpan = startSpan(trace, "llm.response", {
      model: process.env.MODEL_NAME || "openai/gpt-oss-20b"
    });

    const answer = await retry(
      () =>
        generateFinalAnswer({
          input: state.input,
          toolName: agentPlan.tool,
          result,
          memory: getMessages(memory)
        }),
      3,
      isRetryable
    );

    recordLlmCall();
    endSpan(llmSpan, "success");

    addMessage(memory, { role: "assistant", content: answer });
    completeState(state, answer);
    finishTrace(trace, "success");

    recordRequest({
      success: true,
      durationMs: state.durationMs
    });

    logEvent("agent_completed", {
      traceId: trace.traceId,
      durationMs: state.durationMs,
      tool: agentPlan.tool
    });

    return {
      answer,
      trace
    };
  } catch (error) {
    failState(state, error);
    finishTrace(trace, "error");

    recordRequest({
      success: false,
      durationMs: state.durationMs
    });

    logEvent("agent_failed", {
      traceId: trace.traceId,
      errorType: classifyError(error),
      message: error.message
    });

    const publicMessage =
      classifyError(error) === "NOT_FOUND"
        ? "I couldn't find the requested record."
        : publicErrorMessage();

    return {
      answer: publicMessage,
      trace
    };
  }
}
