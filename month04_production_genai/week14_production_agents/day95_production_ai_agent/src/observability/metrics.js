const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalLatencyMs: 0,
  toolCalls: 0,
  toolFailures: 0,
  llmCalls: 0,
  llmInputTokens: 0,
  llmOutputTokens: 0
};

export function recordRequest({ success, durationMs }) {
  metrics.totalRequests += 1;
  metrics.totalLatencyMs += durationMs || 0;

  if (success) metrics.successfulRequests += 1;
  else metrics.failedRequests += 1;
}

export function recordToolCall({ success }) {
  metrics.toolCalls += 1;
  if (!success) metrics.toolFailures += 1;
}

export function recordLlmCall(usage = {}) {
  metrics.llmCalls += 1;
  metrics.llmInputTokens += usage.prompt_tokens || usage.input_tokens || 0;
  metrics.llmOutputTokens += usage.completion_tokens || usage.output_tokens || 0;
}

export function getMetrics() {
  const averageLatencyMs =
    metrics.totalRequests === 0
      ? 0
      : Math.round(metrics.totalLatencyMs / metrics.totalRequests);

  return {
    ...metrics,
    averageLatencyMs
  };
}

export function resetMetrics() {
  for (const key of Object.keys(metrics)) metrics[key] = 0;
}
