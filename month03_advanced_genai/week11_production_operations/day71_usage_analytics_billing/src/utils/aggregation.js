export function aggregateUsage(events) {
  return events.reduce(
    (result, event) => {
      result.requests += 1;

      result.inputTokens += event.inputTokens;

      result.outputTokens += event.outputTokens;

      result.totalTokens += event.totalTokens;

      result.cost += event.cost;

      result.totalLatencyMs += event.latencyMs;

      if (event.status === "success") {
        result.successfulRequests += 1;
      }

      if (event.status !== "success") {
        result.failedRequests += 1;
      }

      return result;
    },
    {
      requests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      cost: 0,
      totalLatencyMs: 0,
    },
  );
}

export function calculateAverageLatency(events) {
  if (!events.length) {
    return 0;
  }

  const total = events.reduce((sum, event) => sum + event.latencyMs, 0);

  return Number((total / events.length).toFixed(2));
}
