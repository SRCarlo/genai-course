import test from "node:test";
import assert from "node:assert/strict";

import { getOrder, cancelOrder } from "../src/tools/order.tool.js";

import { calculate } from "../src/tools/calculator.tool.js";

import { searchKnowledgeBase } from "../src/tools/search.tool.js";

test("getOrder returns an existing order", async () => {
  const result = await getOrder({
    orderId: "ORD-1001",
  });

  assert.equal(result.orderId, "ORD-1001");

  assert.equal(result.status, "shipped");
});

test("getOrder throws for missing order", async () => {
  await assert.rejects(() =>
    getOrder({
      orderId: "ORD-9999",
    }),
  );
});

test("calculator calculates percentage", async () => {
  const result = await calculate({
    expression: "20%of5000",
  });

  assert.equal(result.result, 1000);
});

test("calculator rejects invalid input", async () => {
  await assert.rejects(() =>
    calculate({
      expression: "process.exit()",
    }),
  );
});

test("knowledge base search returns results", async () => {
  const result = await searchKnowledgeBase({
    query: "refund policy",
  });

  assert.ok(result.results.length > 0);
});

test("cancel order returns approval status", async () => {
  const result = await cancelOrder({
    orderId: "ORD-1001",
  });

  assert.equal(result.status, "cancellation_pending_approval");
});
