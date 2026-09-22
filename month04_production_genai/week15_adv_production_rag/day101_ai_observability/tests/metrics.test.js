import test from "node:test";
import assert from "node:assert/strict";
import {
  increment,
  recordTokens,
  recordLatency,
  recordQuality,
  recordCost,
  getMetrics,
  resetMetrics,
} from "../src/infrastructure/observability/metrics.js";

test("metrics should record counters", () => {
  resetMetrics();
  increment("requests");
  increment("requests");
  increment("llmRequests");
  const m = getMetrics();
  assert.equal(m.requests, 2);
  assert.equal(m.llmRequests, 1);
});
test("metrics should calculate error rate", () => {
  resetMetrics();
  increment("requests");
  increment("requests");
  increment("errors");
  assert.equal(getMetrics().errorRate, 0.5);
});
test("metrics should record tokens", () => {
  resetMetrics();
  recordTokens({
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    contextTokens: 80,
  });
  const m = getMetrics();
  assert.equal(m.inputTokens, 100);
  assert.equal(m.outputTokens, 50);
  assert.equal(m.totalTokens, 150);
  assert.equal(m.contextTokens, 80);
});
test("metrics should calculate p95 latency", () => {
  resetMetrics();
  for (let i = 1; i <= 100; i++) recordLatency("request", i);
  assert.equal(getMetrics().p95LatencyMs, 95);
});
test("metrics should record quality", () => {
  resetMetrics();
  recordQuality({ faithfulness: 0.95, answerRelevance: 0.9, recallAt5: 0.88 });
  const m = getMetrics();
  assert.equal(m.faithfulness, 0.95);
  assert.equal(m.answerRelevance, 0.9);
  assert.equal(m.recallAt5, 0.88);
});
test("metrics should record cost", () => {
  resetMetrics();
  recordCost(0.002);
  assert.equal(getMetrics().estimatedCost, 0.002);
});
