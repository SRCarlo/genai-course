import test from "node:test";
import assert from "node:assert/strict";
import { calculateMetrics } from "../src/evaluation/metrics.js";

test("evaluation metrics calculate success rate", () => {
  const metrics = calculateMetrics([
    { pass: true, latencyMs: 100 },
    { pass: true, latencyMs: 200 },
    { pass: false, latencyMs: 300 }
  ]);

  assert.equal(metrics.totalCases, 3);
  assert.equal(metrics.passed, 2);
  assert.equal(metrics.failed, 1);
  assert.equal(metrics.successRate, 66.7);
  assert.equal(metrics.averageLatencyMs, 200);
});
