function evaluateBudgetAlerts({
  tenantId,
  spent,
  budget,
  thresholds = [0.8, 1.0],
}) {
  if (typeof tenantId !== "string" || !tenantId.trim()) {
    throw new TypeError("tenantId is required");
  }

  for (const [name, value] of Object.entries({ spent, budget })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`${name} must be non-negative`);
    }
  }

  if (budget <= 0) {
    throw new TypeError("budget must be greater than zero");
  }

  if (
    !Array.isArray(thresholds) ||
    thresholds.some(
      (threshold) => !Number.isFinite(threshold) || threshold <= 0,
    )
  ) {
    throw new TypeError("thresholds must be positive numbers");
  }

  const utilization = spent / budget;

  return thresholds
    .filter((threshold) => utilization >= threshold)
    .map((threshold) => ({
      tenantId,
      threshold,
      utilization,
      severity: threshold >= 1 ? "CRITICAL" : "WARNING",
      spent,
      budget,
    }));
}

module.exports = { evaluateBudgetAlerts };
