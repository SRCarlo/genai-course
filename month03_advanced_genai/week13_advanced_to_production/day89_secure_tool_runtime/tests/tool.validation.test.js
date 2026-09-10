import test from "node:test";
import assert from "node:assert/strict";

import { getOrderTool } from "../src/tools/get.order.js";
import { refundOrderTool } from "../src/tools/refund.order.js";

test("getOrder accepts valid order ID", () => {
  const result =
    getOrderTool.inputSchema.parse({
      orderId: "12345"
    });

  assert.equal(
    result.orderId,
    "12345"
  );
});

test("getOrder rejects empty order ID", () => {
  assert.throws(() => {
    getOrderTool.inputSchema.parse({
      orderId: ""
    });
  });
});

test("getOrder rejects numeric order ID", () => {
  assert.throws(() => {
    getOrderTool.inputSchema.parse({
      orderId: 12345
    });
  });
});

test("refundOrder requires reason", () => {
  assert.throws(() => {
    refundOrderTool.inputSchema.parse({
      orderId: "12345"
    });
  });
});

test("refundOrder rejects short reason", () => {
  assert.throws(() => {
    refundOrderTool.inputSchema.parse({
      orderId: "12345",
      reason: "no"
    });
  });
});

test("refundOrder accepts valid input", () => {
  const result =
    refundOrderTool.inputSchema.parse({
      orderId: "12345",
      reason: "Customer requested refund"
    });

  assert.equal(
    result.orderId,
    "12345"
  );
});