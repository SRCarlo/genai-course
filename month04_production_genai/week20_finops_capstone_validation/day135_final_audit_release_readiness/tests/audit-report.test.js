"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  REQUIRED_CHECKS,
} = require("../src/audit/release-audit");

const {
  createAuditReport,
} = require("../src/audit/audit-report");

test("creates a report with no blockers for passing checks", () => {
  const checks = Object.fromEntries(
    REQUIRED_CHECKS.map((name) => [name, true])
  );

  const report = createAuditReport({
    version: "1.0.0",
    commit: "abc1234",
    checks,
  });

  assert.equal(report.decision, "PASS");
  assert.equal(report.blockers.length, 0);
  assert.equal(report.commit, "abc1234");
  assert.equal(report.summary.passed, REQUIRED_CHECKS.length);
  assert.ok(Number.isFinite(Date.parse(report.generatedAt)));
});

test("lists failing and missing checks as blockers", () => {
  const checks = Object.fromEntries(
    REQUIRED_CHECKS.map((name) => [name, true])
  );

  checks.aiEvaluation = false;
  delete checks.rollbackPlan;

  const report = createAuditReport({
    version: "1.0.0",
    commit: "def5678",
    checks,
  });

  assert.equal(report.decision, "BLOCKED");
  assert.equal(report.blockers.length, 2);
});

test("requires version and commit", () => {
  assert.throws(
    () =>
      createAuditReport({
        version: "",
        commit: "abc1234",
        checks: {},
      }),
    /version is required/
  );
});
