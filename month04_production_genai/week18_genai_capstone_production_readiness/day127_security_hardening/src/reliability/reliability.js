const DEFAULT_SLO = { successRate: 0.995, latencyP95Ms: 800 };

function validateRatio(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1`);
  }
}

export function calculateSuccessRate({ successfulRequests, eligibleRequests }) {
  if (!Number.isInteger(successfulRequests) || !Number.isInteger(eligibleRequests) ||
      eligibleRequests <= 0 || successfulRequests < 0 || successfulRequests > eligibleRequests) {
    throw new RangeError("Invalid request counts");
  }
  return successfulRequests / eligibleRequests;
}

export function calculateErrorBudget({ eligibleRequests, slo = DEFAULT_SLO.successRate, failedRequests }) {
  validateRatio(slo, "slo");
  if (!Number.isInteger(eligibleRequests) || eligibleRequests < 0 ||
      !Number.isInteger(failedRequests) || failedRequests < 0 || failedRequests > eligibleRequests) {
    throw new RangeError("Invalid request counts");
  }
  const allowedFailures = eligibleRequests * (1 - slo);
  return {
    allowedFailures,
    failedRequests,
    remainingFailures: allowedFailures - failedRequests,
    budgetUsedRatio: allowedFailures === 0 ? (failedRequests === 0 ? 0 : Infinity) : failedRequests / allowedFailures,
    exhausted: failedRequests > allowedFailures,
  };
}

export function percentile(values, p) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError("values must be a non-empty array");
  if (!Number.isFinite(p) || p < 0 || p > 1) throw new RangeError("p must be between 0 and 1");
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError("latencies must be finite and non-negative");
  }
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.max(1, Math.ceil(p * sorted.length));
  return sorted[rank - 1];
}

export function evaluateReliability({ successRate, latencyP95Ms, slo = DEFAULT_SLO }) {
  validateRatio(slo.successRate, "slo.successRate");
  if (!Number.isFinite(successRate) || successRate < 0 || successRate > 1 ||
      !Number.isFinite(latencyP95Ms) || latencyP95Ms < 0 ||
      !Number.isFinite(slo.latencyP95Ms) || slo.latencyP95Ms < 0) {
    throw new RangeError("Invalid reliability measurements");
  }
  const successRateMet = successRate >= slo.successRate;
  const latencyMet = latencyP95Ms <= slo.latencyP95Ms;
  return { successRateMet, latencyMet, overallMet: successRateMet && latencyMet };
}
