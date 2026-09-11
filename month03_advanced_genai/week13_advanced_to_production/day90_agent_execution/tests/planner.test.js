import test from "node:test";
import assert from "node:assert/strict";

import { createDeterministicPlan } from "../src/planning/planner.js";

test("creates refund plan", () => {
  const plan = createDeterministicPlan("Refund order 12345");

  assert.equal(plan.length, 3);

  assert.equal(plan[0].tool, "getOrder");

  assert.equal(plan[1].tool, "checkRefundEligibility");

  assert.equal(plan[2].tool, "refundOrder");
});
