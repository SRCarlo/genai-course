const pricing = {
  "openai/gpt-oss-20b": {
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
  },

  "openai/gpt-oss-120b": {
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
  },

  "qwen/qwen3.6-27b": {
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
  },
};

export function getPricing(model) {
  return (
    pricing[model] || {
      inputPricePerMillion: 0,
      outputPricePerMillion: 0,
    }
  );
}

export function calculateCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion,
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  return inputCost + outputCost;
}
