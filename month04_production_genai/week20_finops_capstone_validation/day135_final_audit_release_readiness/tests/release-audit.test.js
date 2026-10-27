"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  REQUIRED_CHECKS,
  evaluateRelease,
} = require("../src/audit/release-audit");

function passingChecks() {
  return Object.fromEntries(
    REQUIRED_CHECKS.map((name) => [name, true])
  );
}

test("passes when every required check passes", () => {
  const result = evaluateRelease(passingChecks());

  assert.equal(result.decision, "PASS");
  assert.equal(result.passed, REQUIRED_CHECKS.length);
  assert.equal(result.failed, 0);
  assert.equal(result.missing, 0);
});

test("blocks release when a required check fails", () => {
  const checks = passingChecks();
  checks.tenantIsolation = false;

  const result = evaluateRelease(checks);

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.failed, 1);
});

test("blocks release when a required check is missing", () => {
  const checks = passingChecks();
  delete checks.secretScan;

  const result = evaluateRelease(checks);

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.missing, 1);
});

test("does not treat the string true as a passing result", () => {
  const checks = passingChecks();
  checks.dependencyAudit = "true";

  const result = evaluateRelease(checks);

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.missing, 1);
});

test("rejects invalid input", () => {
  assert.throws(
    () => evaluateRelease(null),
    /checks must be an object/
  );
});
