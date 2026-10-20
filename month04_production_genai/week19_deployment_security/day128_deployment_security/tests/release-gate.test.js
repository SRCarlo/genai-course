import test from "node:test";
import assert from "node:assert/strict";
import { evaluateRelease } from "../src/release/release-gate.js";

test("allows release when every required check passes", () => {
  const result = evaluateRelease({
    unitTests: true,
    securityTests: true,
    dependencyAudit: true,
    imageScan: true,
  });

  assert.equal(result.allowed, true);
  assert.deepEqual(result.failures, []);
});

test("blocks release when a required check fails", () => {
  const result = evaluateRelease({
    unitTests: true,
    securityTests: false,
    dependencyAudit: true,
    imageScan: true,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.failures.length, 1);
  assert.equal(result.failures[0].check, "securityTests");
});

test("blocks release when a required check is missing", () => {
  const result = evaluateRelease({
    unitTests: true,
    securityTests: true,
    dependencyAudit: true,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.failures[0].check, "imageScan");
});
