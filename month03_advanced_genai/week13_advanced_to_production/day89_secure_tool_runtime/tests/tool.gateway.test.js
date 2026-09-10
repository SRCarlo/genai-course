import test from "node:test";
import assert from "node:assert/strict";

import { executeTool } from "../src/runtime/tool.gateway.js";

function createContext(
  permissions = ["order:read"]
) {
  return {
    request: {
      id: "test-request"
    },

    user: {
      id: "test-user",
      permissions
    },

    agent: {
      id: "test-agent",
      permissions
    }
  };
}

test("gateway executes authorized getOrder", async () => {
  const result =
    await executeTool({
      toolName: "getOrder",

      arguments: {
        orderId: "12345"
      },

      authContext:
        createContext()
    });

  assert.equal(
    result.success,
    true
  );

  assert.equal(
    result.data.orderId,
    "12345"
  );
});

test("gateway rejects unknown tool", async () => {
  await assert.rejects(
    () =>
      executeTool({
        toolName: "unknownTool",

        arguments: {},

        authContext:
          createContext()
      }),
    {
      message: "TOOL_NOT_FOUND"
    }
  );
});

test("gateway rejects unauthorized refund", async () => {
  await assert.rejects(
    () =>
      executeTool({
        toolName: "refundOrder",

        arguments: {
          orderId: "123",
          reason: "Customer request"
        },

        authContext:
          createContext()
      }),
    {
      message: "TOOL_NOT_AUTHORIZED"
    }
  );
});

test("gateway requires approval for refund", async () => {
  await assert.rejects(
    () =>
      executeTool({
        toolName: "refundOrder",

        arguments: {
          orderId: "123",
          reason: "Customer request"
        },

        authContext:
          createContext([
            "order:read",
            "order:refund"
          ])
      }),
    {
      message:
        "HUMAN_APPROVAL_REQUIRED"
    }
  );
});

test("gateway executes approved refund", async () => {
  const context =
    createContext([
      "order:read",
      "order:refund"
    ]);

  const result =
    await executeTool({
      toolName: "refundOrder",

      arguments: {
        orderId: "123",
        reason: "Customer request"
      },

      authContext: context,

      approval: true
    });

  assert.equal(
    result.success,
    true
  );

  assert.equal(
    result.data.refunded,
    true
  );
});