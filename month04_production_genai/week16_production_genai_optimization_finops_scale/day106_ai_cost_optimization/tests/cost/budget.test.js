import test from "node:test";
import assert from "node:assert/strict";
import {
  checkBudget,
  checkTokenLimits
} from "../../src/cost/cost-guard.js";

test("budget allows request under limit", () => {
  const result = checkBudget({
    currentCost: 2,
    requestCost: 1,
    budget: 5
  });

  assert.equal(result.allowed, true);
  assert.equal(result.projectedCost, 3);
});

test("budget blocks request over limit", () => {
  const result = checkBudget({
    currentCost: 4,
    requestCost: 2,
    budget: 5
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, "BUDGET_EXCEEDED");
});

test("token limits work", () => {
  const result = checkTokenLimits({
    inputTokens: 5000,
    outputTokens: 1000,
    maxInputTokens: 8000,
    maxOutputTokens: 1500
  });

  assert.equal(result.allowed, true);
});