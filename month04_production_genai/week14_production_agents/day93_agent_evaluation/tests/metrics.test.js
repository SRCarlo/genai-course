import test from "node:test";
import assert from "node:assert/strict";
import { calculateMetrics } from "../src/evaluation/metrics.js";

test("calculates pass rate", () => {
  const metrics = calculateMetrics([
    {
      passed: true,
      checks: {},
      category: "basic",
      latencyMs: 100,
      usage: { totalTokens: 10 }
    },
    {
      passed: false,
      checks: {},
      category: "basic",
      latencyMs: 300,
      usage: { totalTokens: 20 }
    }
  ]);

  assert.equal(metrics.taskSuccess, 0.5);
  assert.equal(metrics.averageLatencyMs, 200);
  assert.equal(metrics.averageTokens, 15);
});
