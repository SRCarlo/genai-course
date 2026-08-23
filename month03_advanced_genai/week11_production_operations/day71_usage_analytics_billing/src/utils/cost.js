import { env } from "../config/env.js";

export function calculateCost({ inputTokens = 0, outputTokens = 0 }) {
  const inputCost = (inputTokens / 1_000_000) * env.inputTokenPricePerMillion;

  const outputCost =
    (outputTokens / 1_000_000) * env.outputTokenPricePerMillion;

  return Number((inputCost + outputCost).toFixed(8));
}
