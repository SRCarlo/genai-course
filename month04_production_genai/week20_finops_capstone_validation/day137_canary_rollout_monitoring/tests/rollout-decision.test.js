"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateCanary,
} = require("../src/rollout/rollout-decision");

const healthyMetrics = {
  sampleSize: 500,
  errorRate: 0.01,
  p95LatencyMs: 900,
  costIncreasePercent: 10,
  qualityDropPercent: 2,
};

test("promotes a healthy canary with enough samples", () => {
  const result = evaluateCanary(healthyMetrics);

  assert.equal(result.decision, "PROMOTE");
});

test("holds when sample size is too small", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    sampleSize: 25,
  });

  assert.equal(result.decision, "HOLD");
});

test("rolls back when error rate exceeds the limit", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    errorRate: 0.08,
  });

  assert.equal(result.decision, "ROLLBACK");
  assert.ok(result.reasons.length > 0);
});

test("rolls back when p95 latency exceeds the limit", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    p95LatencyMs: 1500,
  });

  assert.equal(result.decision, "ROLLBACK");
});

test("rolls back when provider cost rises too much", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    costIncreasePercent: 35,
  });

  assert.equal(result.decision, "ROLLBACK");
});

test("rolls back when evaluation quality drops too much", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    qualityDropPercent: 8,
  });

  assert.equal(result.decision, "ROLLBACK");
});

test("holds if a required metric is missing", () => {
  const metrics = { ...healthyMetrics };
  delete metrics.p95LatencyMs;

  assert.equal(evaluateCanary(metrics).decision, "HOLD");
});

test("holds for invalid metric ranges", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    errorRate: 1.5,
  });

  assert.equal(result.decision, "HOLD");
});

test("rollback guardrails take priority over low sample size", () => {
  const result = evaluateCanary({
    ...healthyMetrics,
    sampleSize: 10,
    errorRate: 0.1,
  });

  assert.equal(result.decision, "ROLLBACK");
});

test("supports custom thresholds", () => {
  const result = evaluateCanary(
    healthyMetrics,
    { maxErrorRate: 0.005 }
  );

  assert.equal(result.decision, "ROLLBACK");
});
