import test from "node:test";
import assert from "node:assert/strict";
import {
  requiresApproval,
  isActionAllowed,
  getApprovalDecision
} from "../../src/governance/approval.js";

test("classifies AI-allowed actions", () => {
  assert.equal(isActionAllowed("DRAFT_EMAIL"), true);
  assert.equal(getApprovalDecision("SEARCH_KNOWLEDGE_BASE"), "AI_ALLOWED");
});

test("requires human approval for high-impact actions", () => {
  assert.equal(requiresApproval("DELETE_RECORD"), true);
  assert.equal(getApprovalDecision("HIGH_IMPACT_DECISION"), "HUMAN_REQUIRED");
});

test("denies unknown or explicitly prohibited actions", () => {
  assert.equal(getApprovalDecision("BYPASS_SECURITY_CONTROL"), "DENIED");
  assert.equal(getApprovalDecision("UNKNOWN_ACTION"), "DENIED");
});
