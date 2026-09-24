export function securityGate(results) {
  const criticalFailures = results.filter(
    result => result.severity === "CRITICAL" && !result.passed
  );

  return {
    passed: criticalFailures.length === 0,
    criticalFailures
  };
}
