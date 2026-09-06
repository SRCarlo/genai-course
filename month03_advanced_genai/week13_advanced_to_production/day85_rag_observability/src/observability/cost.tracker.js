export function calculateCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion
}) {
  const inputCost =
    (inputTokens / 1_000_000) *
    inputPricePerMillion;

  const outputCost =
    (outputTokens / 1_000_000) *
    outputPricePerMillion;

  return {
    inputCost,
    outputCost,
    totalCost:
      inputCost + outputCost
  };
}