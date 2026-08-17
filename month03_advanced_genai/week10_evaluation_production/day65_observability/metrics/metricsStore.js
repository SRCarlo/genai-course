import { calculatePercentile } from "../observability/metrics.js";

const metrics = {
  requests: 0,

  successes: 0,

  errors: 0,

  llmCalls: 0,

  ragCalls: 0,

  toolCalls: 0,

  totalLatencyMs: 0,

  totalInputTokens: 0,

  totalOutputTokens: 0,

  totalTokens: 0,

  latencies: [],
};

export function increment(metric, amount = 1) {
  if (!Object.prototype.hasOwnProperty.call(metrics, metric)) {
    throw new Error(`Unknown metric: ${metric}`);
  }

  if (typeof metrics[metric] !== "number") {
    throw new Error(`Metric is not numeric: ${metric}`);
  }

  metrics[metric] += amount;
}

export function recordRequest({
  status,
  latencyMs,
  llmCalls = 0,
  ragCalls = 0,
  toolCalls = 0,
  inputTokens = 0,
  outputTokens = 0,
  totalTokens = 0,
}) {
  metrics.requests += 1;

  if (status === "success") {
    metrics.successes += 1;
  }

  if (status === "error") {
    metrics.errors += 1;
  }

  metrics.llmCalls += llmCalls;

  metrics.ragCalls += ragCalls;

  metrics.toolCalls += toolCalls;

  metrics.totalLatencyMs += latencyMs;

  metrics.totalInputTokens += inputTokens;

  metrics.totalOutputTokens += outputTokens;

  metrics.totalTokens += totalTokens;

  metrics.latencies.push(latencyMs);
}

export function getMetrics() {
  const averageLatencyMs =
    metrics.requests === 0 ? 0 : metrics.totalLatencyMs / metrics.requests;

  const successRate =
    metrics.requests === 0 ? 0 : metrics.successes / metrics.requests;

  const errorRate =
    metrics.requests === 0 ? 0 : metrics.errors / metrics.requests;

  return {
    requests: metrics.requests,

    successes: metrics.successes,

    errors: metrics.errors,

    successRate: Number(successRate.toFixed(4)),

    errorRate: Number(errorRate.toFixed(4)),

    averageLatencyMs: Number(averageLatencyMs.toFixed(2)),

    p95LatencyMs: calculatePercentile(metrics.latencies, 95),

    llmCalls: metrics.llmCalls,

    ragCalls: metrics.ragCalls,

    toolCalls: metrics.toolCalls,

    totalInputTokens: metrics.totalInputTokens,

    totalOutputTokens: metrics.totalOutputTokens,

    totalTokens: metrics.totalTokens,
  };
}

export function resetMetrics() {
  metrics.requests = 0;

  metrics.successes = 0;

  metrics.errors = 0;

  metrics.llmCalls = 0;

  metrics.ragCalls = 0;

  metrics.toolCalls = 0;

  metrics.totalLatencyMs = 0;

  metrics.totalInputTokens = 0;

  metrics.totalOutputTokens = 0;

  metrics.totalTokens = 0;

  metrics.latencies = [];
}
