import test from "node:test";
import assert from "node:assert/strict";

import { getTool } from "../src/tools/tool.registry.js";
import { authorizeTool } from "../src/security/authorization.js";

const getOrder =
  getTool("getOrder");

const refundOrder =
  getTool("refundOrder");

const deleteCustomer =
  getTool("deleteCustomer");

test("support can read orders", () => {
  assert.equal(
    authorizeTool({
      tool: getOrder,
      userPermissions: ["order:read"],
      agentPermissions: ["order:read"]
    }),
    true
  );
});

test("support cannot refund", () => {
  assert.equal(
    authorizeTool({
      tool: refundOrder,
      userPermissions: ["order:read"],
      agentPermissions: ["order:read"]
    }),
    false
  );
});

test("finance can refund", () => {
  assert.equal(
    authorizeTool({
      tool: refundOrder,
      userPermissions: [
        "order:read",
        "order:refund"
      ],
      agentPermissions: [
        "order:read",
        "order:refund"
      ]
    }),
    true
  );
});

test("user without permission is denied", () => {
  assert.equal(
    authorizeTool({
      tool: getOrder,
      userPermissions: [],
      agentPermissions: ["order:read"]
    }),
    false
  );
});

test("agent without permission is denied", () => {
  assert.equal(
    authorizeTool({
      tool: getOrder,
      userPermissions: ["order:read"],
      agentPermissions: []
    }),
    false
  );
});

test("admin can delete customers", () => {
  assert.equal(
    authorizeTool({
      tool: deleteCustomer,
      userPermissions: [
        "customer:delete"
      ],
      agentPermissions: [
        "customer:delete"
      ]
    }),
    true
  );
});

test("finance cannot delete customers", () => {
  assert.equal(
    authorizeTool({
      tool: deleteCustomer,
      userPermissions: [
        "order:refund"
      ],
      agentPermissions: [
        "order:refund"
      ]
    }),
    false
  );
});