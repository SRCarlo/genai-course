export function calculateCost({
  inputTokens = 0,
  outputTokens = 0,
  inputPricePerMillion = Number(process.env.INPUT_PRICE_PER_MILLION || 0),
  outputPricePerMillion = Number(process.env.OUTPUT_PRICE_PER_MILLION || 0),
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  return inputCost + outputCost;
}
