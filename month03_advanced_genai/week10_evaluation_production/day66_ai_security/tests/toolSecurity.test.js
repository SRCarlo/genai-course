import { describe, expect, test } from "vitest";

import {
  isToolAllowed,
  requiresHumanApproval,
} from "../policies/toolPolicy.js";

import {
  validateToolCall,
  validateToolArguments,
} from "../security/toolGuard.js";

describe("Tool Security", () => {
  test("allows knowledge search", () => {
    expect(isToolAllowed("knowledge_search")).toBe(true);
  });

  test("allows calculator", () => {
    expect(isToolAllowed("calculator")).toBe(true);
  });

  test("rejects delete_user", () => {
    expect(isToolAllowed("delete_user")).toBe(false);
  });

  test("rejects unknown tools", () => {
    const result = validateToolCall({
      toolName: "format_disk",
      arguments: {},
    });

    expect(result.allowed).toBe(false);
  });

  test("rejects disabled tools", () => {
    const result = validateToolCall({
      toolName: "delete_user",
      arguments: {},
    });

    expect(result.allowed).toBe(false);
  });

  test("requires approval for dangerous tools", () => {
    expect(requiresHumanApproval("delete_user")).toBe(true);
  });

  test("validates knowledge search arguments", () => {
    const result = validateToolArguments({
      toolName: "knowledge_search",
      arguments: {
        query: "refund policy",
      },
    });

    expect(result.valid).toBe(true);
  });

  test("rejects empty search query", () => {
    const result = validateToolArguments({
      toolName: "knowledge_search",
      arguments: {
        query: "",
      },
    });

    expect(result.valid).toBe(false);
  });

  test("validates calculator expression", () => {
    const result = validateToolArguments({
      toolName: "calculator",
      arguments: {
        expression: "10 + 20 * 2",
      },
    });

    expect(result.valid).toBe(true);
  });

  test("rejects dangerous calculator expression", () => {
    const result = validateToolArguments({
      toolName: "calculator",
      arguments: {
        expression: "process.exit()",
      },
    });

    expect(result.valid).toBe(false);
  });
});
