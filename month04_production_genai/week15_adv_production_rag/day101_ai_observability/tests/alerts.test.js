import test from "node:test";
import assert from "node:assert/strict";
import { checkAlerts } from "../src/infrastructure/observability/alerts.js";

test("should alert on high error rate", () => {
  const a = checkAlerts({
    errorRate: 0.15,
    p95LatencyMs: 1000,
    faithfulness: 0.95,
    recallAt5: 0.9,
    requests: 100,
    estimatedCost: 0,
  });
  const x = a.find((i) => i.type === "HIGH_ERROR_RATE");
  assert.ok(x);
  assert.equal(x.severity, "CRITICAL");
});
test("should alert on high latency", () => {
  const a = checkAlerts({
    errorRate: 0.001,
    p95LatencyMs: 2500,
    faithfulness: 0.95,
    recallAt5: 0.9,
    requests: 100,
    estimatedCost: 0,
  });
  assert.ok(a.some((i) => i.type === "HIGH_LATENCY"));
});
test("should alert on quality degradation", () => {
  const a = checkAlerts({
    errorRate: 0.001,
    p95LatencyMs: 1000,
    faithfulness: 0.8,
    recallAt5: 0.9,
    requests: 100,
    estimatedCost: 0,
  });
  assert.ok(a.some((i) => i.type === "QUALITY_DEGRADATION"));
});
test("should alert on retrieval degradation", () => {
  const a = checkAlerts({
    errorRate: 0.001,
    p95LatencyMs: 1000,
    faithfulness: 0.95,
    recallAt5: 0.7,
    requests: 100,
    estimatedCost: 0,
  });
  assert.ok(a.some((i) => i.type === "RETRIEVAL_DEGRADATION"));
});
test("should alert on cost spike", () => {
  const a = checkAlerts({
    errorRate: 0.001,
    p95LatencyMs: 1000,
    faithfulness: 0.95,
    recallAt5: 0.9,
    requests: 1,
    estimatedCost: 0.05,
  });
  assert.ok(a.some((i) => i.type === "COST_SPIKE"));
});
