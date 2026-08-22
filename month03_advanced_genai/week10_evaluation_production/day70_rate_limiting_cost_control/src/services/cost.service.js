import { getPricing, calculateCost } from "../utils/pricing.js";

export function calculateRequestCost(usage, model) {
  const pricing = getPricing(model);

  const cost = calculateCost({
    inputTokens: usage.inputTokens,

    outputTokens: usage.outputTokens,

    inputPricePerMillion: pricing.inputPricePerMillion,

    outputPricePerMillion: pricing.outputPricePerMillion,
  });

  return {
    model,

    inputTokens: usage.inputTokens,

    outputTokens: usage.outputTokens,

    totalTokens: usage.totalTokens,

    inputPricePerMillion: pricing.inputPricePerMillion,

    outputPricePerMillion: pricing.outputPricePerMillion,

    estimatedCost: Number(cost.toFixed(8)),
  };
}
