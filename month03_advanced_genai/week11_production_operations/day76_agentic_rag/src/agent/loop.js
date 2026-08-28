import { tools } from "../tools/tool.registry.js";
import { planNextAction } from "./planner.js";
import { shouldTerminate } from "./termination.js";
import { validateToolCall } from "../guardrails/tool.guard.js";

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Tool execution timed out."));
      }, timeoutMs);
    }),
  ]);
}

function safeParseArguments(argumentsString) {
  try {
    return JSON.parse(argumentsString);
  } catch {
    throw new Error("Invalid JSON arguments from model.");
  }
}

async function executeToolCall(toolCall, state) {
  const toolName = toolCall.function.name;

  const tool = tools[toolName];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  const args = safeParseArguments(toolCall.function.arguments);

  const validation = validateToolCall(toolName, args, tool);

  if (!validation.allowed) {
    throw new Error(validation.reason);
  }

  const startTime = Date.now();

  const result = await withTimeout(
    Promise.resolve(tool.execute(...Object.values(args))),
    tool.timeoutMs,
  );

  const latencyMs = Date.now() - startTime;

  state.metrics.totalToolLatencyMs += latencyMs;

  return {
    toolName,
    args,
    result,
    latencyMs,
  };
}

export async function runAgentLoop(state) {
  while (!shouldTerminate(state)) {
    state.iteration++;

    let message;

    try {
      message = await planNextAction(state);
    } catch (error) {
      state.status = "error";

      state.errors.push({
        type: "LLM_ERROR",
        message: error.message,
      });

      break;
    }

    state.messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      state.finalAnswer =
        message.content || "I could not generate a final answer.";

      state.status = "completed";

      break;
    }

    for (const toolCall of message.tool_calls) {
      try {
        const execution = await executeToolCall(toolCall, state);

        state.toolCalls.push({
          iteration: state.iteration,
          tool: execution.toolName,
          arguments: execution.args,
          latencyMs: execution.latencyMs,
          success: true,
        });

        state.metrics.toolCalls++;

        state.observations.push(execution.result);

        state.messages.push({
          role: "tool",

          tool_call_id: toolCall.id,

          content: JSON.stringify(execution.result),
        });
      } catch (error) {
        state.toolCalls.push({
          iteration: state.iteration,
          tool: toolCall.function.name,
          success: false,
          error: error.message,
        });

        state.metrics.toolCalls++;

        const errorResult = {
          success: false,
          error: error.message,
        };

        state.observations.push(errorResult);

        state.messages.push({
          role: "tool",

          tool_call_id: toolCall.id,

          content: JSON.stringify(errorResult),
        });
      }
    }
  }

  return state;
}
