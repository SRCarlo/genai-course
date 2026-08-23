import test from "node:test";
import assert from "node:assert/strict";

import { checkBudget } from "../src/services/alert.service.js";

test("normal budget", () => {
  const result = checkBudget({
    currentCost: 10,
    budget: 100,
  });

  assert.equal(result.level, "NORMAL");
});

test("warning budget", () => {
  const result = checkBudget({
    currentCost: 70,
    budget: 100,
  });

  assert.equal(result.level, "WARNING");
});

test("high budget", () => {
  const result = checkBudget({
    currentCost: 90,
    budget: 100,
  });

  assert.equal(result.level, "HIGH");
});

test("critical budget", () => {
  const result = checkBudget({
    currentCost: 96,
    budget: 100,
  });

  assert.equal(result.level, "CRITICAL");
});

test("budget exceeded", () => {
  const result = checkBudget({
    currentCost: 100,
    budget: 100,
  });

  assert.equal(result.level, "BUDGET_EXCEEDED");
});
