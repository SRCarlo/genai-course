"use strict";

const REQUIRED_CHECKS = [
  "unitTests",
  "integrationTests",
  "tenantIsolation",
  "secretScan",
  "dependencyAudit",
  "aiEvaluation",
  "quotaEnforcement",
  "observability",
  "rollbackPlan",
];

function evaluateRelease(checks) {
  if (
    checks === null ||
    typeof checks !== "object" ||
    Array.isArray(checks)
  ) {
    throw new TypeError("checks must be an object");
  }

  const results = REQUIRED_CHECKS.map((name) => {
    const value = checks[name];

    let status = "missing";

    if (value === true) {
      status = "passed";
    } else if (value === false) {
      status = "failed";
    }

    return { name, status };
  });

  const failed = results.filter(
    (item) => item.status === "failed"
  );

  const missing = results.filter(
    (item) => item.status === "missing"
  );

  return {
    decision:
      failed.length === 0 && missing.length === 0
        ? "PASS"
        : "BLOCKED",
    total: results.length,
    passed: results.filter(
      (item) => item.status === "passed"
    ).length,
    failed: failed.length,
    missing: missing.length,
    checks: results,
  };
}

module.exports = {
  REQUIRED_CHECKS,
  evaluateRelease,
};
