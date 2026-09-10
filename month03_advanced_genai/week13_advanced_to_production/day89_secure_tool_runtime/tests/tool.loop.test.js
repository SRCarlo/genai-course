import test from "node:test";
import assert from "node:assert/strict";

import { runAgent } from "../src/runtime/agent.loop.js";

test("agent returns final response", async () => {
  const result =
    await runAgent({
      llm: async () => ({
        text: "Done"
      }),

      messages: [],

      executeTool:
        async () => {
          throw new Error(
            "Should not execute"
          );
        }
    });

  assert.equal(
    result,
    "Done"
  );
});

test("agent executes tool then continues", async () => {
  let calls = 0;

  const result =
    await runAgent({
      llm: async () => {
        calls++;

        if (calls === 1) {
          return {
            toolCall: {
              tool: "getOrder",
              arguments: {
                orderId: "123"
              }
            }
          };
        }

        return {
          text: "Order shipped"
        };
      },

      messages: [],

      executeTool:
        async () => ({
          success: true,
          data: {
            status: "shipped"
          }
        })
    });

  assert.equal(
    result,
    "Order shipped"
  );

  assert.equal(
    calls,
    2
  );
});

test("agent stops at maximum tool calls", async () => {
  await assert.rejects(
    () =>
      runAgent({
        llm: async () => ({
          toolCall: {
            tool: "getOrder",
            arguments: {
              orderId: "123"
            }
          }
        }),

        messages: [],

        executeTool:
          async () => ({
            success: true
          }),

        maxToolCalls: 3
      }),
    {
      message:
        "AGENT_MAX_TOOL_CALLS"
    }
  );
});