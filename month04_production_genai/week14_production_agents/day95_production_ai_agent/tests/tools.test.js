import test from "node:test";
import assert from "node:assert/strict";
import { getOrder } from "../src/tools/getOrder.js";
import { getCustomer } from "../src/tools/getCustomer.js";
import { searchKnowledge } from "../src/tools/searchKnowledge.js";
import { updateCustomer } from "../src/tools/updateCustomer.js";

test("getOrder returns a valid order", async () => {
  const order = await getOrder({ orderId: "ORD-1001" });
  assert.equal(order.status, "shipped");
});

test("getOrder returns null for unknown order", async () => {
  const order = await getOrder({ orderId: "ORD-9999" });
  assert.equal(order, null);
});

test("getCustomer returns valid customer", async () => {
  const customer = await getCustomer({ customerId: "CUST-001" });
  assert.equal(customer.email, "demo@example.com");
});

test("searchKnowledge finds refund policy", async () => {
  const result = await searchKnowledge({ query: "refund policy" });
  assert.equal(result.length, 1);
});

test("updateCustomer rejects missing arguments", async () => {
  await assert.rejects(
    () => updateCustomer({ customerId: "CUST-001" }),
    /customerId and email are required/
  );
});
