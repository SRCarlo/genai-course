import test from "node:test";
import assert from "node:assert/strict";
import { checkBudget } from "../../src/performance/performance-budget.js";

test("budget detects an exceeded stage", () => {
  const result = checkBudget("retrieval", 600);
  assert.equal(result.budgetMs, 500);
  assert.equal(result.exceeded, true);
});

test("budget accepts a stage under target", () => {
  const result = checkBudget("retrieval", 300);
  assert.equal(result.exceeded, false);
});
