import test from "node:test";
import assert from "node:assert/strict";
import { createAgentIdentity } from "../src/security/agent.identity.js";
import { getRiskLevel, requiresHumanApproval } from "../src/security/risk.policy.js";
import { hasAgentPermission } from "../src/security/agent.authorization.js";

test("agent identity requires id", () => {
  assert.throws(() => createAgentIdentity({
    agentType: "support",
    permissions: []
  }), /INVALID_AGENT_IDENTITY/);
});

test("agent identity stores least-privilege permissions", () => {
  const agent = createAgentIdentity({
    agentId: "a1",
    agentType: "support",
    permissions: ["order:read"]
  });
  assert.deepEqual(agent.permissions, ["order:read"]);
});

test("unknown tool gets critical risk", () => {
  assert.equal(getRiskLevel("unknownTool"), "CRITICAL");
});

test("refund is high risk", () => {
  assert.equal(getRiskLevel("refundOrder"), "HIGH");
});

test("delete is critical risk", () => {
  assert.equal(getRiskLevel("deleteCustomer"), "CRITICAL");
});

test("high risk requires approval", () => {
  assert.equal(requiresHumanApproval("HIGH"), true);
});

test("low risk does not require approval", () => {
  assert.equal(requiresHumanApproval("LOW"), false);
});

test("agent permission is checked independently", () => {
  const agent = { permissions: ["order:read"] };
  assert.equal(hasAgentPermission(agent, "order:refund"), false);
});
