import { describe, expect, test } from "vitest";

import { getOrder } from "../src/tools/get-order.tool.js";
import { calculate } from "../src/tools/calculator.tool.js";
import { searchKnowledgeBase } from "../src/tools/search.tool.js";
import { validateToolCall } from "../src/tools/tool.validator.js";

describe("getOrder tool", () => {
  test("returns existing order", async () => {
    const result = await getOrder({
      orderId: "ORD-1001",
    });

    expect(result.success).toBe(true);
    expect(result.data.orderId).toBe("ORD-1001");
  });

  test("returns failure for missing order", async () => {
    const result = await getOrder({
      orderId: "ORD-9999",
    });

    expect(result.success).toBe(false);
  });
});

describe("calculator tool", () => {
  test("adds numbers", async () => {
    const result = await calculate({
      a: 10,
      b: 20,
      operation: "add",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBe(30);
  });

  test("multiplies numbers", async () => {
    const result = await calculate({
      a: 5000,
      b: 0.2,
      operation: "multiply",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBe(1000);
  });

  test("prevents division by zero", async () => {
    const result = await calculate({
      a: 10,
      b: 0,
      operation: "divide",
    });

    expect(result.success).toBe(false);
  });
});

describe("knowledge base tool", () => {
  test("finds refund policy", async () => {
    const result = await searchKnowledgeBase({
      query: "refund policy",
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBeGreaterThan(0);
  });
});

describe("tool validation", () => {
  test("accepts valid order ID", () => {
    const result = validateToolCall("getOrder", {
      orderId: "ORD-1001",
    });

    expect(result.success).toBe(true);
  });

  test("rejects invalid order ID", () => {
    const result = validateToolCall("getOrder", {
      orderId: 12345,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid calculator operation", () => {
    const result = validateToolCall("calculator", {
      a: 10,
      b: 20,
      operation: "eval",
    });

    expect(result.success).toBe(false);
  });
});
