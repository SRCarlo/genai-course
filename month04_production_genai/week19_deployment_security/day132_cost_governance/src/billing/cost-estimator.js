function estimateModelCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion,
}) {
  const values = {
    inputTokens,
    outputTokens,
    inputPricePerMillion,
    outputPricePerMillion,
  };

  for (const [name, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`${name} must be a non-negative number`);
    }
  }

  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

module.exports = { estimateModelCost };
