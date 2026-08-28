import { validateInput } from "../src/guardrails/input.guard.js";

import { validateToolCall } from "../src/guardrails/tool.guard.js";

describe("Input Guard", () => {
  test("rejects empty input", () => {
    const result = validateInput("");

    expect(result.valid).toBe(false);
  });

  test("accepts normal input", () => {
    const result = validateInput("Check order ORD-123");

    expect(result.valid).toBe(true);
  });
});

describe("Tool Guard", () => {
  test("rejects unknown tool", () => {
    const result = validateToolCall("deleteAccount", {}, null);

    expect(result.allowed).toBe(false);
  });

  test("allows authorized tool", () => {
    const tool = {
      permissions: ["calculator:use"],
    };

    const result = validateToolCall(
      "calculator",
      {
        expression: "10 + 20",
      },
      tool,
    );

    expect(result.allowed).toBe(true);
  });
});
