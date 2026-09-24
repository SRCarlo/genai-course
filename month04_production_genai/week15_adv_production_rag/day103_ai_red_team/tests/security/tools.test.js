import { describe, expect, it } from "vitest";
import {
  validateToolCall,
  authorizeToolCall,
  validateAndAuthorizeToolCall
} from "../../src/security/tool-validator.js";

describe("tool security", () => {
  it("validates required arguments", () => {
    expect(validateToolCall("searchDocuments", { query: "test" })).toBe(true);
    expect(validateToolCall("searchDocuments", {})).toBe(false);
  });

  it("requires authorization for deleteDocument", () => {
    const result = authorizeToolCall("deleteDocument", {
      canUseHighImpactTools: false
    });

    expect(result.allowed).toBe(false);
    expect(result.confirmationRequired).toBe(true);
  });

  it("allows search with valid arguments", () => {
    const result = validateAndAuthorizeToolCall(
      "searchDocuments",
      { query: "policy" },
      { canUseHighImpactTools: false }
    );

    expect(result.allowed).toBe(true);
  });
});
