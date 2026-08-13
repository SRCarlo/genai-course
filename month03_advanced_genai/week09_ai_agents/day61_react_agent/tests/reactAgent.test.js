import { describe, test, expect } from "@jest/globals";

import { executeAction } from "../backend/react/reactLoop.js";

describe("ReAct tool execution", () => {
  test("calculator tool should execute", async () => {
    const result = await executeAction({
      type: "tool",

      tool: "calculator",

      input: {
        expression: "10 + 20",
      },
    });

    expect(result.result).toBe(30);
  });

  test("unknown tool should fail", async () => {
    await expect(
      executeAction({
        type: "tool",

        tool: "unknown",

        input: {},
      }),
    ).rejects.toThrow("Tool not allowed");
  });
});
