import { describe, it, expect } from "vitest";

import { validateInput } from "../src/ai/guardrails/input.guard.js";

describe("Support Agent Guardrails", () => {
  it("should accept a valid message", () => {
    expect(validateInput("Where is my order?")).toBe(true);
  });

  it("should reject empty input", () => {
    expect(() => validateInput("")).toThrow();
  });
});
