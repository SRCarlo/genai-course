import test from "node:test";
import assert from "node:assert/strict";
import { alertRules } from "../src/alerting/alert-rules.js";
import { evaluateAlert, evaluateAllAlerts } from "../src/alerting/evaluate-alerts.js";

const apiFailureRule = alertRules.find((rule) => rule.id === "api-failure-rate-high");

test("fires when API failures exceed the threshold", () => {
  const result = evaluateAlert(apiFailureRule, { value: 0.08, sampleCount: 200 });
  assert.equal(result.status, "firing");
  assert.equal(result.severity, "SEV-2");
});

test("does not fire when the failure rate is below threshold", () => {
  const result = evaluateAlert(apiFailureRule, { value: 0.01, sampleCount: 200 });
  assert.equal(result.status, "ok");
});

test("reports insufficient data instead of a false all-clear", () => {
  const result = evaluateAlert(apiFailureRule, { value: 0.5, sampleCount: 20 });
  assert.equal(result.status, "insufficient_data");
});

test("rejects invalid measurements", () => {
  assert.throws(
    () => evaluateAlert(apiFailureRule, { value: Number.NaN, sampleCount: 200 }),
    RangeError,
  );
});

test("reports missing telemetry as no_data", () => {
  const results = evaluateAllAlerts(alertRules, {});
  assert.equal(results.length, alertRules.length);
  assert.ok(results.every((result) => result.status === "no_data"));
});

test("supports latency alerts", () => {
  const latencyRule = alertRules.find((rule) => rule.id === "api-p95-latency-high");
  const result = evaluateAlert(latencyRule, { value: 1200, sampleCount: 500 });
  assert.equal(result.status, "firing");
});
