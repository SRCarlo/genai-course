import { describe, expect, it } from "vitest";
import {
  validateInputLength,
  validateContextSize,
  assertToolCallLimit,
  assertRetryLimit
} from "../../src/security/resource-limits.js";

describe("resource limits", () => {
  it("blocks oversized input", () => {
    expect(validateInputLength("x".repeat(8001))).toBe(false);
  });

  it("blocks oversized context", () => {
    expect(validateContextSize("x".repeat(12001))).toBe(false);
  });

  it("blocks excessive tool calls", () => {
    expect(() => assertToolCallLimit(10)).toThrow();
  });

  it("blocks excessive retries", () => {
    expect(() => assertRetryLimit(3)).toThrow();
  });
});
