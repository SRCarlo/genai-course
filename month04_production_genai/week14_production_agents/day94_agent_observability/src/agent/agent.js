import { callGroq } from "../llm/groqClient.js";
import { config } from "../config/observability.js";
import { logger } from "../observability/logger.js";
import { createTrace, endTrace } from "../observability/trace.js";
import { startSpan, endSpan } from "../observability/span.js";
import { estimateCost } from "../observability/cost.js";
import { classifyError } from "../observability/errors.js";
import { search } from "../tools/searchTool.js";

function usageOf(response) {
  const usage = response?.usage || {};
  return {
    inputTokens: usage.prompt_tokens ?? usage.input_tokens ?? 0,
    outputTokens: usage.completion_tokens ?? usage.output_tokens ?? 0,
    totalTokens: usage.total_tokens ?? 0
  };
}

async function runLlm(trace, metrics, messages, operation) {
  const span = startSpan(trace, "llm.call", {
    spanType: "llm",
    operation,
    model: config.model
  });

  const started = Date.now();

  try {
    const response = await callGroq(messages);
    const usage = usageOf(response);

    const costUsd = estimateCost({
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      inputPrice: config.inputPricePer1M,
      outputPrice: config.outputPricePer1M
    });

    const latencyMs = Date.now() - started;

    endSpan(span, "success", {
      attributes: {
        ...span.attributes,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        costUsd
      }
    });

    metrics.llmCalls += 1;
    metrics.totalInputTokens += usage.inputTokens;
    metrics.totalOutputTokens += usage.outputTokens;
    metrics.totalTokens += usage.totalTokens;
    metrics.totalCostUsd += costUsd;

    logger.info("llm_completed", {
      traceId: trace.traceId,
      spanId: span.spanId,
      operation,
      model: config.model,
      latencyMs,
      ...usage,
      costUsd
    });

    return response;
  } catch (error) {
    const latencyMs = Date.now() - started;
    const errorType = classifyError(error);

    endSpan(span, "error", {
      error: {
        type: errorType,
        message: error.message
      }
    });

    metrics.llmCalls += 1;
    metrics.llmFailures += 1;

    logger.error("llm_failed", {
      traceId: trace.traceId,
      spanId: span.spanId,
      operation,
      errorType,
      latencyMs,
      message: error.message
    });

    throw error;
  }
}

async function runSearchTool(trace, metrics, query) {
  const span = startSpan(trace, "tool.search", {
    spanType: "tool",
    tool: "search"
  });

  const started = Date.now();

  try {
    const result = await search(query);
    const latencyMs = Date.now() - started;

    endSpan(span, "success", {
      attributes: {
        ...span.attributes,
        resultCount: result.length
      }
    });

    metrics.toolCalls += 1;

    logger.info("tool_completed", {
      traceId: trace.traceId,
      spanId: span.spanId,
      tool: "search",
      latencyMs,
      resultCount: result.length
    });

    return result;
  } catch (error) {
    const latencyMs = Date.now() - started;
    const errorType = classifyError(error);

    endSpan(span, "error", {
      error: {
        type: errorType,
        message: error.message
      }
    });

    metrics.toolCalls += 1;
    metrics.toolFailures += 1;

    logger.error("tool_failed", {
      traceId: trace.traceId,
      spanId: span.spanId,
      tool: "search",
      errorType,
      latencyMs
    });

    throw error;
  }
}

export async function runAgent(userInput, { metrics } = {}) {
  const trace = createTrace();
  const localMetrics = metrics || {
    requests: 0,
    successes: 0,
    failures: 0,
    toolCalls: 0,
    toolFailures: 0,
    llmCalls: 0,
    llmFailures: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    totalLatencyMs: 0,
    latenciesMs: [],
    totalCostUsd: 0
  };

  localMetrics.requests += 1;

  logger.info("agent_started", {
    traceId: trace.traceId,
    requestId: trace.requestId,
    correlationId: trace.correlationId,
    agent: "research-agent",
    model: config.model
  });

  const agentSpan = startSpan(trace, "agent.execute", {
    spanType: "agent",
    agent: "research-agent"
  });

  const started = Date.now();

  try {
    const planResponse = await runLlm(
      trace,
      localMetrics,
      [
        {
          role: "system",
          content: "You are an agent planner. Extract a short search query from the user's request. Return only the search query."
        },
        { role: "user", content: userInput }
      ],
      "planning"
    );

    const searchQuery = planResponse.choices[0]?.message?.content?.trim() || userInput;
    const documents = await runSearchTool(trace, localMetrics, searchQuery);

    const finalResponse = await runLlm(
      trace,
      localMetrics,
      [
        {
          role: "system",
          content: "You are a helpful production support agent. Answer using only the supplied search results. If the answer is not present, say you could not find it."
        },
        {
          role: "user",
          content: JSON.stringify({
            question: userInput,
            searchResults: documents
          })
        }
      ],
      "final_answer"
    );

    const answer = finalResponse.choices[0]?.message?.content?.trim() || "No response generated.";

    endSpan(agentSpan, "success", {
      attributes: {
        ...agentSpan.attributes,
        result: "completed"
      }
    });

    const durationMs = Date.now() - started;
    localMetrics.successes += 1;
    localMetrics.totalLatencyMs += durationMs;
    localMetrics.latenciesMs.push(durationMs);

    endTrace(trace, "success");

    logger.info("agent_completed", {
      traceId: trace.traceId,
      requestId: trace.requestId,
      durationMs,
      status: "success"
    });

    return {
      answer,
      trace
    };
  } catch (error) {
    const durationMs = Date.now() - started;
    const errorType = classifyError(error);

    endSpan(agentSpan, "error", {
      error: {
        type: errorType,
        message: error.message
      }
    });

    localMetrics.failures += 1;
    localMetrics.totalLatencyMs += durationMs;
    localMetrics.latenciesMs.push(durationMs);

    endTrace(trace, "error");

    logger.error("agent_failed", {
      traceId: trace.traceId,
      requestId: trace.requestId,
      errorType,
      durationMs
    });

    throw error;
  }
}
