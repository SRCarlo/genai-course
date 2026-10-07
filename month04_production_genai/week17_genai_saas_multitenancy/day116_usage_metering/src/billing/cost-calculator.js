import { MODEL_PRICING } from "./pricing.js";

export function calculateCost({
  model,
  inputTokens,
  outputTokens
}) {
  const pricing = MODEL_PRICING[model];

  if (!pricing) {
    throw new Error(`Unknown model pricing: ${model}`);
  }

  const inputCost =
    (inputTokens / 1_000_000) * pricing.inputPerMillion;

  const outputCost =
    (outputTokens / 1_000_000) * pricing.outputPerMillion;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    currency: "USD"
  };
}
