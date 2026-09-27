export function calculateCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion
}) {
  validateNonNegative("inputTokens", inputTokens);
  validateNonNegative("outputTokens", outputTokens);
  validateNonNegative("inputPricePerMillion", inputPricePerMillion);
  validateNonNegative("outputPricePerMillion", outputPricePerMillion);

  const inputCost =
    (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost =
    (outputTokens / 1_000_000) * outputPricePerMillion;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

export function calculateRetryCost({
  attempts,
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion
}) {
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error("attempts must be an integer >= 1");
  }

  const singleAttempt = calculateCost({
    inputTokens,
    outputTokens,
    inputPricePerMillion,
    outputPricePerMillion
  });

  return {
    attempts,
    singleAttemptCost: singleAttempt.totalCost,
    totalCost: singleAttempt.totalCost * attempts,
    extraCost:
      singleAttempt.totalCost * Math.max(0, attempts - 1)
  };
}

function validateNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
}