import test from "node:test";
import assert from "node:assert/strict";
import { runQualityGate } from "../evaluation/quality-gate.js";

test("quality gate passes when all thresholds pass", () => {
  const result = runQualityGate({
    recallAt5: 0.9,
    precisionAt5: 0.8,
    faithfulness: 0.95,
    answerRelevance: 0.9,
  });

  assert.equal(result.passed, true);
  assert.deepEqual(result.failures, []);
});

test("quality gate fails when metrics fall below thresholds", () => {
  const result = runQualityGate({
    recallAt5: 0.5,
    precisionAt5: 0.8,
    faithfulness: 0.95,
    answerRelevance: 0.9,
  });

  assert.equal(result.passed, false);
  assert.deepEqual(result.failures, ["recallAt5"]);
});
