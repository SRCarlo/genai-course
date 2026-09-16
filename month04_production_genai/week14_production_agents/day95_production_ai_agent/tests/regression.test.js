import test from "node:test";
import assert from "node:assert/strict";
import { plan } from "../src/agent/planner.js";

test("regression: order ID must win over generic order wording", () => {
  const result = plan("Can you find order ORD-1001 for me?");
  assert.equal(result.tool, "getOrder");
  assert.equal(result.args.orderId, "ORD-1001");
});

test("regression: refund questions use knowledge search", () => {
  const result = plan("Can you explain your refund policy?");
  assert.equal(result.tool, "searchKnowledge");
});
