import test from "node:test";
import assert from "node:assert/strict";

import { getOrder } from "../src/tools/get.order.js";

import { checkRefundEligibility } from "../src/tools/check.refund.js";

test("getOrder returns order", async () => {
  const result = await getOrder({
    orderId: "12345",
  });

  assert.equal(result.success, true);

  assert.equal(result.order.orderId, "12345");
});

test("refund eligibility is true", async () => {
  const result = await checkRefundEligibility({
    orderId: "12345",
  });

  assert.equal(result.eligible, true);
});
