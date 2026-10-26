"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { getBudgetStatus } = require("../src/finops/budget-status");

test("reports healthy status below the warning threshold", () => {
  const result = getBudgetStatus({ spent: 30, budget: 50 });

  assert.equal(result.status, "healthy");
  assert.equal(result.remaining, 20);
  assert.equal(result.utilization, 60);
});

test("reports warning at 80 percent utilization", () => {
  const result = getBudgetStatus({ spent: 40, budget: 50 });

  assert.equal(result.status, "warning");
  assert.equal(result.warning, true);
});

test("reports over budget when spend exceeds the budget", () => {
  const result = getBudgetStatus({ spent: 60, budget: 50 });

  assert.equal(result.status, "over_budget");
  assert.equal(result.remaining, 0);
});

test("handles an unconfigured zero budget", () => {
  const result = getBudgetStatus({ spent: 0, budget: 0 });

  assert.equal(result.status, "no_budget");
  assert.equal(result.utilization, null);
});

test("rejects negative spend", () => {
  assert.throws(
    () => getBudgetStatus({ spent: -1, budget: 50 }),
    /non-negative/
  );
});
