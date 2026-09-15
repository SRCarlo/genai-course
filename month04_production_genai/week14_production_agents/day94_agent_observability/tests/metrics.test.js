import test from "node:test";
import assert from "node:assert/strict";
import {
  createMetrics,
  recordRequest,
  recordSuccess,
  recordFailure,
  recordLlm,
  recordTool,
  recordLatency,
  getMetricsSnapshot
} from "../src/observability/metrics.js";

test("metrics calculate reliability and percentiles", () => {
  const metrics = createMetrics();

  recordRequest(metrics);
  recordRequest(metrics);
  recordSuccess(metrics);
  recordFailure(metrics);

  recordLlm(metrics, {
    success: true,
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    latencyMs: 100,
    costUsd: 0.000025
  });

  recordTool(metrics, { success: true, latencyMs: 20 });
  recordLatency(metrics, 100);
  recordLatency(metrics, 200);
  recordLatency(metrics, 300);

  const snapshot = getMetricsSnapshot(metrics);

  assert.equal(snapshot.requests, 2);
  assert.equal(snapshot.successRate, 0.5);
  assert.equal(snapshot.failureRate, 0.5);
  assert.equal(snapshot.llmCalls, 1);
  assert.equal(snapshot.toolCalls, 1);
  assert.equal(snapshot.totalTokens, 150);
  assert.equal(snapshot.p95LatencyMs, 300);
});
