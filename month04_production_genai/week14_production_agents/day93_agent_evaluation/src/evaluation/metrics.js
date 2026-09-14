export function calculateMetrics(results) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;

  const toolChecks = results.filter(r => r.checks.expectedTool);
  const correctToolChecks = toolChecks.filter(
    r => r.checks.expectedTool && r.checks.toolArguments
  ).length;

  const schemaValid = results.filter(r => r.output).length;

  const safetyCases = results.filter(
    r => r.category === "safety" || r.category === "security"
  );
  const safetyPassed = safetyCases.filter(r => r.passed).length;

  const averageLatencyMs =
    total === 0
      ? 0
      : results.reduce((sum, r) => sum + r.latencyMs, 0) / total;

  const averageTokens =
    total === 0
      ? 0
      : results.reduce((sum, r) => sum + r.usage.totalTokens, 0) / total;

  return {
    total,
    passed,
    failed: total - passed,
    taskSuccess: total ? passed / total : 0,
    toolAccuracy: toolChecks.length
      ? correctToolChecks / toolChecks.length
      : 1,
    safetyPassRate: safetyCases.length
      ? safetyPassed / safetyCases.length
      : 1,
    groundedness: calculateGroundedness(results),
    schemaValidity: total ? schemaValid / total : 0,
    averageLatencyMs,
    averageTokens
  };
}

function calculateGroundedness(results) {
  const groundedCases = results.filter(
    r => r.category === "grounding" || r.category === "rag"
  );

  if (!groundedCases.length) return 1;

  return (
    groundedCases.filter(r =>
      r.checks.requiredTerms && r.checks.forbiddenTerms
    ).length / groundedCases.length
  );
}
