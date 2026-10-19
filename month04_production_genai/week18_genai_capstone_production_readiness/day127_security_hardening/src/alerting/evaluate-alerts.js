function isValidMeasurement(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function evaluateAlert(rule, measurement) {
  if (!rule || !measurement) throw new TypeError("rule and measurement are required");
  if (!isValidMeasurement(measurement.value)) {
    throw new RangeError("measurement.value must be non-negative");
  }
  if (!Number.isInteger(measurement.sampleCount) || measurement.sampleCount < 0) {
    throw new RangeError("sampleCount must be a non-negative integer");
  }
  if (!Number.isFinite(rule.threshold) || rule.threshold < 0 ||
      !Number.isInteger(rule.minimumSamples) || rule.minimumSamples < 1) {
    throw new RangeError("Invalid alert rule");
  }

  const operators = {
    gt: (v, t) => v > t,
    gte: (v, t) => v >= t,
    lt: (v, t) => v < t,
    lte: (v, t) => v <= t,
  };
  const compare = operators[rule.operator];
  if (!compare) throw new RangeError("Unsupported alert operator");

  const enoughSamples = measurement.sampleCount >= rule.minimumSamples;
  const breached = enoughSamples && compare(measurement.value, rule.threshold);
  return {
    ruleId: rule.id, service: rule.service, severity: rule.severity,
    metric: rule.metric, observedValue: measurement.value, threshold: rule.threshold,
    sampleCount: measurement.sampleCount,
    status: !enoughSamples ? "insufficient_data" : breached ? "firing" : "ok",
    summary: rule.summary, runbook: rule.runbook,
  };
}

export function evaluateAllAlerts(rules, measurements) {
  if (!Array.isArray(rules) || !measurements || typeof measurements !== "object") {
    throw new TypeError("rules and measurements are required");
  }
  return rules.map((rule) => {
    const measurement = measurements[rule.metric];
    if (!measurement) {
      return {
        ruleId: rule.id, service: rule.service, severity: rule.severity,
        metric: rule.metric, status: "no_data", summary: rule.summary,
        runbook: rule.runbook,
      };
    }
    return evaluateAlert(rule, measurement);
  });
}
