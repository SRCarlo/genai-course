import test from "node:test";
import assert from "node:assert/strict";

import { getTool } from "../src/tools/tool.registry.js";
import { authorizeTool } from "../src/security/authorization.js";

test("unknown tool is not in registry", () => {
  assert.equal(
    getTool("unknownTool"),
    null
  );
});

test("support cannot delete customer", () => {
  const tool =
    getTool("deleteCustomer");

  assert.equal(
    authorizeTool({
      tool,
      userPermissions: [
        "order:read"
      ],
      agentPermissions: [
        "order:read"
      ]
    }),
    false
  );
});

test("unauthorized user cannot refund", () => {
  const tool =
    getTool("refundOrder");

  assert.equal(
    authorizeTool({
      tool,
      userPermissions: [
        "order:read"
      ],
      agentPermissions: [
        "order:read",
        "order:refund"
      ]
    }),
    false
  );
});

test("malicious object fails order ID validation", () => {
  const tool =
    getTool("getOrder");

  assert.throws(() => {
    tool.inputSchema.parse({
      orderId: {
        $gt: ""
      }
    });
  });
});

test("empty order ID fails validation", () => {
  const tool =
    getTool("getOrder");

  assert.throws(() => {
    tool.inputSchema.parse({
      orderId: ""
    });
  });
});

test("refund without approval cannot execute", async () => {
  const tool =
    getTool("refundOrder");

  assert.equal(
    tool.risk,
    "HIGH"
  );
});

test("delete customer is critical", () => {
  const tool =
    getTool("deleteCustomer");

  assert.equal(
    tool.risk,
    "CRITICAL"
  );
});