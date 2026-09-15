export function createMetrics() {
  return {
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
}

export function recordRequest(metrics) {
  metrics.requests += 1;
}

export function recordSuccess(metrics) {
  metrics.successes += 1;
}

export function recordFailure(metrics) {
  metrics.failures += 1;
}

export function recordTool(metrics, { success, latencyMs }) {
  metrics.toolCalls += 1;
  if (!success) metrics.toolFailures += 1;
}

export function recordLlm(metrics, { success, inputTokens = 0, outputTokens = 0, totalTokens = 0, latencyMs = 0, costUsd = 0 }) {
  metrics.llmCalls += 1;
  if (!success) metrics.llmFailures += 1;
  metrics.totalInputTokens += inputTokens;
  metrics.totalOutputTokens += outputTokens;
  metrics.totalTokens += totalTokens;
  metrics.totalLatencyMs += latencyMs;
  metrics.totalCostUsd += costUsd;
}

export function recordLatency(metrics, latencyMs) {
  metrics.totalLatencyMs += latencyMs;
  metrics.latenciesMs.push(latencyMs);
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export function getMetricsSnapshot(metrics) {
  const requests = metrics.requests || 1;

  return {
    requests: metrics.requests,
    successRate: metrics.successes / requests,
    failureRate: metrics.failures / requests,
    toolErrorRate: metrics.toolCalls ? metrics.toolFailures / metrics.toolCalls : 0,
    llmErrorRate: metrics.llmCalls ? metrics.llmFailures / metrics.llmCalls : 0,
    avgLatencyMs: metrics.latenciesMs.length
      ? metrics.latenciesMs.reduce((a, b) => a + b, 0) / metrics.latenciesMs.length
      : 0,
    p50LatencyMs: percentile(metrics.latenciesMs, 50),
    p95LatencyMs: percentile(metrics.latenciesMs, 95),
    p99LatencyMs: percentile(metrics.latenciesMs, 99),
    llmCalls: metrics.llmCalls,
    toolCalls: metrics.toolCalls,
    inputTokens: metrics.totalInputTokens,
    outputTokens: metrics.totalOutputTokens,
    totalTokens: metrics.totalTokens,
    estimatedCostUsd: metrics.totalCostUsd
  };
}
