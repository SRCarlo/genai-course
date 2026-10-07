import test from "node:test";
import assert from "node:assert/strict";
import { calculateCost } from "../src/billing/cost-calculator.js";

test("input and output cost are calculated", () => {
  const result = calculateCost({
    model: "openai/gpt-oss-20b",
    inputTokens: 1_000_000,
    outputTokens: 1_000_000
  });

  assert.equal(result.inputCost, 0.075);
  assert.equal(result.outputCost, 0.3);
  assert.equal(result.totalCost, 0.375);
});

test("unknown model pricing throws", () => {
  assert.throws(() =>
    calculateCost({
      model: "unknown-model",
      inputTokens: 100,
      outputTokens: 100
    })
  );
});
