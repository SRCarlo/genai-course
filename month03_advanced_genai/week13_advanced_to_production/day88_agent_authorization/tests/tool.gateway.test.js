import test from "node:test";
import assert from "node:assert/strict";
import { executeTool } from "../src/security/tool.gateway.js";
import { tools } from "../src/tools/index.js";
import { supportAgent } from "../src/agents/support.agent.js";
import { financeAgent } from "../src/agents/finance.agent.js";
import { adminAgent } from "../src/agents/admin.agent.js";
import { getUserPermissions } from "../src/security/authorization.js";

function context(role, agent, id = "user-123") {
  return {
    user: { id, role, permissions: getUserPermissions(role) },
    agent,
    request: { id: `req-${Math.random()}` }
  };
}

test("support can search orders", async () => {
  const result = await executeTool({
    tool: tools.searchOrders,
    arguments: { customerId: "user-123" },
    authContext: context("support", supportAgent)
  });
  assert.equal(result.tool, "searchOrders");
});

test("support cannot refund", async () => {
  await assert.rejects(
    executeTool({
      tool: tools.refundOrder,
      arguments: { orderId: "ORD-1", reason: "Customer request" },
      authContext: context("support", supportAgent)
    }),
    /TOOL_NOT_AUTHORIZED/
  );
});

test("finance refund requires approval", async () => {
  const result = await executeTool({
    tool: tools.refundOrder,
    arguments: { orderId: "ORD-1", reason: "Customer request" },
    authContext: context("manager", financeAgent)
  });
  assert.equal(result.status, "APPROVAL_REQUIRED");
});

test("finance refund executes after approval", async () => {
  const result = await executeTool({
    tool: tools.refundOrder,
    arguments: { orderId: "ORD-1", reason: "Customer request" },
    authContext: context("manager", financeAgent),
    requireApproval: true
  });
  assert.equal(result.status, "REFUNDED");
});

test("admin delete requires approval", async () => {
  const result = await executeTool({
    tool: tools.deleteCustomer,
    arguments: { customerId: "user-999", reason: "Account closure" },
    authContext: context("admin", adminAgent)
  });
  assert.equal(result.status, "APPROVAL_REQUIRED");
});

test("admin delete executes after approval", async () => {
  const result = await executeTool({
    tool: tools.deleteCustomer,
    arguments: { customerId: "user-999", reason: "Account closure" },
    authContext: context("admin", adminAgent),
    requireApproval: true
  });
  assert.equal(result.status, "DELETED");
});

test("unknown tool is denied", async () => {
  await assert.rejects(
    executeTool({
      tool: undefined,
      arguments: {},
      authContext: context("admin", adminAgent)
    }),
    /TOOL_NOT_FOUND/
  );
});

test("malformed refund arguments are rejected", async () => {
  await assert.rejects(
    executeTool({
      tool: tools.refundOrder,
      arguments: { orderId: "", reason: 123 },
      authContext: context("manager", financeAgent)
    }),
    /INVALID_TOOL_ARGUMENTS/
  );
});

test("malformed delete arguments are rejected", async () => {
  await assert.rejects(
    executeTool({
      tool: tools.deleteCustomer,
      arguments: { customerId: "", reason: "x" },
      authContext: context("admin", adminAgent)
    }),
    /INVALID_TOOL_ARGUMENTS/
  );
});

test("support can read customer", async () => {
  const result = await executeTool({
    tool: tools.getCustomer,
    arguments: { customerId: "user-123" },
    authContext: context("support", supportAgent)
  });
  assert.equal(result.tool, "getCustomer");
});
