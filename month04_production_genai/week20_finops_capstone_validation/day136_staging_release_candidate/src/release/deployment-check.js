"use strict";

function evaluateDeployment({
  live,
  ready,
  smokeTestsPassed,
  releaseMatches,
}) {
  const checks = {
    live,
    ready,
    smokeTestsPassed,
    releaseMatches,
  };

  for (const [name, value] of Object.entries(checks)) {
    if (typeof value !== "boolean") {
      throw new TypeError(`${name} must be a boolean`);
    }
  }

  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  return {
    decision: failed.length === 0 ? "PASS" : "BLOCKED",
    checks,
    failed,
  };
}

module.exports = { evaluateDeployment };
