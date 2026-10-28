"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateDeployment,
} = require("../src/release/deployment-check");

test("passes when all deployment checks pass", () => {
  const result = evaluateDeployment({
    live: true,
    ready: true,
    smokeTestsPassed: true,
    releaseMatches: true,
  });

  assert.equal(result.decision, "PASS");
  assert.deepEqual(result.failed, []);
});

test("blocks when readiness fails", () => {
  const result = evaluateDeployment({
    live: true,
    ready: false,
    smokeTestsPassed: true,
    releaseMatches: true,
  });

  assert.equal(result.decision, "BLOCKED");
  assert.deepEqual(result.failed, ["ready"]);
});

test("blocks when the deployed release does not match", () => {
  const result = evaluateDeployment({
    live: true,
    ready: true,
    smokeTestsPassed: true,
    releaseMatches: false,
  });

  assert.equal(result.decision, "BLOCKED");
  assert.ok(result.failed.includes("releaseMatches"));
});

test("rejects missing or non-boolean check values", () => {
  assert.throws(
    () =>
      evaluateDeployment({
        live: true,
        ready: true,
        smokeTestsPassed: "yes",
        releaseMatches: true,
      }),
    /smokeTestsPassed must be a boolean/
  );
});
