import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateCost,
  calculateRetryCost
} from "../../src/cost/cost-calculator.js";

test("calculateCost returns correct token cost", () => {
  const result = calculateCost({
    inputTokens: 2000,
    outputTokens: 500,
    inputPricePerMillion: 1,
    outputPricePerMillion: 4
  });

  assert.equal(result.inputCost, 0.002);
  assert.equal(result.outputCost, 0.002);
  assert.equal(result.totalCost, 0.004);
});

test("calculateRetryCost multiplies cost by attempts", () => {
  const result = calculateRetryCost({
    attempts: 3,
    inputTokens: 2000,
    outputTokens: 500,
    inputPricePerMillion: 1,
    outputPricePerMillion: 4
  });

  assert.equal(result.totalCost, 0.012);
  assert.equal(result.extraCost, 0.008);
});