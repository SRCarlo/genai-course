"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateRelease,
  REQUIRED_CHECKS,
} = require("../src/release/release-policy");

const passingChecks = Object.fromEntries(
  REQUIRED_CHECKS.map((key) => [key, true])
);

test("approves staging when all checks pass", () => {
  const result = evaluateRelease({
    environment: "staging",
    checks: passingChecks,
  });

  assert.equal(result.decision, "APPROVE");
});

test("blocks release when unit tests fail", () => {
  const result = evaluateRelease({
    environment: "staging",
    checks: {
      ...passingChecks,
      unitTests: false,
    },
  });

  assert.equal(result.decision, "BLOCK");
});

test("holds when evidence is missing", () => {
  const result = evaluateRelease({
    environment: "staging",
    checks: {
      unitTests: true,
    },
  });

  assert.equal(result.decision, "HOLD");
});

test("requires canary promotion for production", () => {
  const result = evaluateRelease({
    environment: "production",
    checks: passingChecks,
    canaryDecision: "HOLD",
    approval: {
      approved: true,
      approverId: "release-manager-01",
    },
  });

  assert.equal(result.decision, "HOLD");
});

test("requires production approval", () => {
  const result = evaluateRelease({
    environment: "production",
    checks: passingChecks,
    canaryDecision: "PROMOTE",
  });

  assert.equal(result.decision, "HOLD");
});

test("holds when approver identity is missing", () => {
  const result = evaluateRelease({
    environment: "production",
    checks: passingChecks,
    canaryDecision: "PROMOTE",
    approval: {
      approved: true,
      approverId: "",
    },
  });

  assert.equal(result.decision, "HOLD");
});

test("approves production when all policy conditions pass", () => {
  const result = evaluateRelease({
    environment: "production",
    checks: passingChecks,
    canaryDecision: "PROMOTE",
    approval: {
      approved: true,
      approverId: "release-manager-01",
    },
  });

  assert.equal(result.decision, "APPROVE");
});

test("rolls back an already deployed candidate", () => {
  const result = evaluateRelease({
    environment: "production",
    alreadyDeployed: true,
    canaryDecision: "ROLLBACK",
  });

  assert.equal(result.decision, "ROLLBACK");
});

test("blocks an undeployed candidate with rollback signal", () => {
  const result = evaluateRelease({
    environment: "production",
    checks: passingChecks,
    canaryDecision: "ROLLBACK",
    approval: {
      approved: true,
      approverId: "release-manager-01",
    },
  });

  assert.equal(result.decision, "BLOCK");
});

test("rejects invalid environment", () => {
  assert.throws(
    () => evaluateRelease({
      environment: "development",
      checks: passingChecks,
    }),
    /Invalid deployment environment/
  );
});

test("rejects invalid input", () => {
  assert.throws(
    () => evaluateRelease(null),
    /Release input must be an object/
  );
});
