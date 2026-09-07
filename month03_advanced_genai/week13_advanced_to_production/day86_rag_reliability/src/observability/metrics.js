const metrics = {
  totalRequests: 0,

  successfulRequests: 0,

  failedRequests: 0,

  llmTimeouts: 0,

  retrievalFailures: 0,

  rateLimitedRequests: 0,

  totalLatencyMs: 0,
};

export function recordRequest() {
  metrics.totalRequests++;
}

export function recordSuccess() {
  metrics.successfulRequests++;
}

export function recordFailure() {
  metrics.failedRequests++;
}

export function recordTimeout() {
  metrics.llmTimeouts++;
}

export function recordRetrievalFailure() {
  metrics.retrievalFailures++;
}

export function recordRateLimit() {
  metrics.rateLimitedRequests++;
}

export function recordLatency(milliseconds) {
  metrics.totalLatencyMs += milliseconds;
}

export function getMetrics() {
  const averageLatency =
    metrics.totalRequests > 0
      ? metrics.totalLatencyMs / metrics.totalRequests
      : 0;

  return {
    ...metrics,

    averageLatencyMs: Number(averageLatency.toFixed(2)),
  };
}
