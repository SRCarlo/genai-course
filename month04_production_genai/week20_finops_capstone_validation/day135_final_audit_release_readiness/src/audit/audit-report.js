"use strict";

const { evaluateRelease } = require("./release-audit");

function createAuditReport({
  version,
  commit,
  checks,
}) {
  if (typeof version !== "string" || !version.trim()) {
    throw new TypeError("version is required");
  }

  if (typeof commit !== "string" || !commit.trim()) {
    throw new TypeError("commit is required");
  }

  const result = evaluateRelease(checks);

  return {
    version,
    commit,
    generatedAt: new Date().toISOString(),
    decision: result.decision,
    summary: {
      total: result.total,
      passed: result.passed,
      failed: result.failed,
      missing: result.missing,
    },
    blockers: result.checks
      .filter((item) => item.status !== "passed")
      .map((item) => ({
        check: item.name,
        reason:
          item.status === "missing"
            ? "No verified passing result supplied"
            : "Required check failed",
      })),
    checks: result.checks,
  };
}

module.exports = { createAuditReport };
