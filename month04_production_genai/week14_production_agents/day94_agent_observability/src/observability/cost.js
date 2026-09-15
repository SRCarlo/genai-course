export function estimateCost({
  inputTokens = 0,
  outputTokens = 0,
  inputPrice = 0.075,
  outputPrice = 0.30
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPrice;
  const outputCost = (outputTokens / 1_000_000) * outputPrice;

  return inputCost + outputCost;
}
