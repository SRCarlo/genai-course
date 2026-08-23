import test from "node:test";
import assert from "node:assert/strict";

import { calculateBilling, getPlan } from "../src/services/billing.service.js";

test("calculates billing", () => {
  const result = calculateBilling({
    providerCost: 10,
    markup: 3,
  });

  assert.equal(result.providerCost, 10);

  assert.equal(result.customerCharge, 30);

  assert.equal(result.grossMargin, 20);
});

test("returns plan", () => {
  const plan = getPlan("pro");

  assert.equal(plan.monthlyTokens, 2_000_000);

  assert.equal(plan.monthlyBudget, 25);
});
