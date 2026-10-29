"use strict";

const DEFAULT_THRESHOLDS = Object.freeze({
  minSamples: 100,
  maxErrorRate: 0.02,
  maxP95LatencyMs: 1200,
  maxCostIncreasePercent: 20,
  maxQualityDropPercent: 5,
});

function evaluateCanary(metrics, overrides = {}) {
  const thresholds = {
    ...DEFAULT_THRESHOLDS,
    ...overrides,
  };

  if (!metrics || typeof metrics !== "object") {
    throw new TypeError("metrics must be an object");
  }

  const required = [
    "sampleSize",
    "errorRate",
    "p95LatencyMs",
    "costIncreasePercent",
    "qualityDropPercent",
  ];

  const missing = required.filter(
    (key) =>
      !Object.hasOwn(metrics, key) ||
      typeof metrics[key] !== "number" ||
      !Number.isFinite(metrics[key])
  );

  if (missing.length > 0) {
    return {
      decision: "HOLD",
      reasons: [`Missing or invalid metrics: ${missing.join(", ")}`],
    };
  }

  if (
    !Number.isInteger(metrics.sampleSize) ||
    metrics.sampleSize < 0 ||
    metrics.errorRate < 0 ||
    metrics.errorRate > 1 ||
    metrics.p95LatencyMs < 0 ||
    metrics.costIncreasePercent < -100 ||
    metrics.qualityDropPercent < 0
  ) {
    return {
      decision: "HOLD",
      reasons: ["Metrics are outside valid ranges"],
    };
  }

  const breaches = [];

  if (metrics.errorRate > thresholds.maxErrorRate) {
    breaches.push("Error rate exceeds limit");
  }

  if (metrics.p95LatencyMs > thresholds.maxP95LatencyMs) {
    breaches.push("p95 latency exceeds limit");
  }

  if (
    metrics.costIncreasePercent >
    thresholds.maxCostIncreasePercent
  ) {
    breaches.push("Cost increase exceeds limit");
  }

  if (
    metrics.qualityDropPercent >
    thresholds.maxQualityDropPercent
  ) {
    breaches.push("Quality drop exceeds limit");
  }

  // A measured hard-guardrail breach takes priority
  // over the minimum sample requirement.
  if (breaches.length > 0) {
    return {
      decision: "ROLLBACK",
      reasons: breaches,
    };
  }

  if (metrics.sampleSize < thresholds.minSamples) {
    return {
      decision: "HOLD",
      reasons: [
        `Need at least ${thresholds.minSamples} samples`,
      ],
    };
  }

  return {
    decision: "PROMOTE",
    reasons: ["All configured guardrails passed"],
  };
}

module.exports = {
  DEFAULT_THRESHOLDS,
  evaluateCanary,
};
