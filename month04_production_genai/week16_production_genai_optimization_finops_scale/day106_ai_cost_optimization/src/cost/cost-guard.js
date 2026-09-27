export function checkBudget({
  currentCost,
  requestCost,
  budget
}) {
  const projected = currentCost + requestCost;

  return {
    allowed: projected <= budget,
    projectedCost: projected,
    budget,
    reason: projected > budget ? "BUDGET_EXCEEDED" : undefined
  };
}

export function checkTokenLimits({
  inputTokens,
  outputTokens,
  maxInputTokens,
  maxOutputTokens
}) {
  const inputAllowed = inputTokens <= maxInputTokens;
  const outputAllowed = outputTokens <= maxOutputTokens;

  return {
    allowed: inputAllowed && outputAllowed,
    inputAllowed,
    outputAllowed
  };
}