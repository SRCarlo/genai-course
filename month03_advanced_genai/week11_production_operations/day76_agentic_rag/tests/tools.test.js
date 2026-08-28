import { calculate } from "../src/tools/calculator.tool.js";

import { getOrder } from "../src/tools/order.tool.js";

import { searchKnowledgeBase } from "../src/tools/search.tool.js";

describe("Calculator Tool", () => {
  test("calculates percentages", () => {
    const result = calculate("50000 * 0.20");

    expect(result.success).toBe(true);

    expect(result.result).toBe(10000);
  });

  test("rejects unsafe expressions", () => {
    expect(() => calculate("process.exit()")).toThrow();
  });

  test("rejects division by zero", () => {
    expect(() => calculate("10 / 0")).toThrow();
  });
});

describe("Order Tool", () => {
  test("returns existing order", async () => {
    const result = await getOrder("ORD-123");

    expect(result.success).toBe(true);

    expect(result.order.orderId).toBe("ORD-123");
  });

  test("handles missing order", async () => {
    const result = await getOrder("ORD-999");

    expect(result.success).toBe(false);
  });
});

describe("Knowledge Base Tool", () => {
  test("finds refund policy", async () => {
    const result = await searchKnowledgeBase("refund policy");

    expect(result.success).toBe(true);

    expect(result.results.length).toBeGreaterThan(0);
  });
});
