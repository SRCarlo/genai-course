import test from "node:test";
import assert from "node:assert/strict";
import { canProcessData } from "../../src/governance/data-policy.js";
import { getRetentionDays } from "../../src/governance/retention-policy.js";

test("enforces data classification policy", () => {
  assert.equal(canProcessData("PUBLIC"), true);
  assert.equal(canProcessData("INTERNAL"), true);
  assert.equal(canProcessData("CONFIDENTIAL"), false);
  assert.equal(canProcessData("RESTRICTED"), false);
});

test("returns retention policy values", () => {
  assert.equal(getRetentionDays("prompts"), 30);
  assert.equal(getRetentionDays("auditLogs"), 365);
});
