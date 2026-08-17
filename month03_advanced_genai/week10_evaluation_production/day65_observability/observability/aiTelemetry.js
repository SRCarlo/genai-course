export function createLLMTelemetry({
  model,
  inputTokens = 0,
  outputTokens = 0,
}) {
  return {
    model,

    inputTokens,

    outputTokens,

    totalTokens: inputTokens + outputTokens,
  };
}

export function extractUsage(response) {
  const usage = response?.usage || {};

  const inputTokens = usage.prompt_tokens ?? 0;

  const outputTokens = usage.completion_tokens ?? 0;

  const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;

  return {
    inputTokens,
    outputTokens,
    totalTokens,
  };
}

export function calculateEstimatedCost({
  inputTokens = 0,
  outputTokens = 0,
  inputPricePerMillion = 0,
  outputPricePerMillion = 0,
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  return Number((inputCost + outputCost).toFixed(8));
}
