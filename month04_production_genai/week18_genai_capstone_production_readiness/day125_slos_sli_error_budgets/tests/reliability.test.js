import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSuccessRate, calculateErrorBudget, percentile, evaluateReliability,
} from "../src/reliability/reliability.js";
import { createLatencyCollector } from "../src/reliability/latency-sample.js";

test("calculates request success rate", () => {
  assert.equal(calculateSuccessRate({ successfulRequests: 995, eligibleRequests: 1000 }), 0.995);
});
test("rejects invalid request counts", () => {
  assert.throws(() => calculateSuccessRate({ successfulRequests: 11, eligibleRequests: 10 }), RangeError);
});
test("calculates an available error budget", () => {
  const result = calculateErrorBudget({ eligibleRequests: 10000, slo: 0.995, failedRequests: 20 });
  assert.ok(Math.abs(result.allowedFailures - 50) < 1e-9);
  assert.equal(result.failedRequests, 20);
  assert.equal(result.exhausted, false);
  assert.ok(result.remainingFailures > 0);
});
test("detects an exhausted error budget", () => {
  const result = calculateErrorBudget({ eligibleRequests: 10000, slo: 0.995, failedRequests: 70 });
  assert.equal(result.exhausted, true);
  assert.ok(result.budgetUsedRatio > 1);
});
test("calculates nearest-rank p95 without mutating input", () => {
  const values = [500, 100, 300, 200, 400];
  assert.equal(percentile(values, 0.95), 500);
  assert.deepEqual(values, [500, 100, 300, 200, 400]);
});
test("rejects invalid percentile inputs", () => {
  assert.throws(() => percentile([], 0.95), RangeError);
  assert.throws(() => percentile([100, -1], 0.95), RangeError);
  assert.throws(() => percentile([100, 200], 1.5), RangeError);
});
test("evaluates latency and success SLOs together", () => {
  const result = evaluateReliability({ successRate: 0.997, latencyP95Ms: 750 });
  assert.equal(result.successRateMet, true);
  assert.equal(result.latencyMet, true);
  assert.equal(result.overallMet, true);
});
test("fails when latency SLO is missed", () => {
  const result = evaluateReliability({ successRate: 0.999, latencyP95Ms: 1200 });
  assert.equal(result.overallMet, false);
  assert.equal(result.latencyMet, false);
});
test("collector keeps only recent samples", () => {
  const collector = createLatencyCollector({ maxSamples: 2 });
  collector.record(100); collector.record(200); collector.record(300);
  assert.deepEqual(collector.snapshot(), [200, 300]);
});
test("collector rejects invalid values", () => {
  const collector = createLatencyCollector();
  assert.throws(() => collector.record(-1), RangeError);
  assert.throws(() => createLatencyCollector({ maxSamples: 0 }), RangeError);
});
