import { SLO } from "../../../config/slo.js";
export function checkAlerts(metrics) {
  const alerts = [];
  if (metrics.errorRate > SLO.maxErrorRate)
    alerts.push({
      type: "HIGH_ERROR_RATE",
      severity: metrics.errorRate >= 0.1 ? "CRITICAL" : "WARNING",
      value: metrics.errorRate,
      threshold: SLO.maxErrorRate,
      message: "Error rate exceeded configured SLO.",
    });
  if (metrics.p95LatencyMs > SLO.maxP95LatencyMs)
    alerts.push({
      type: "HIGH_LATENCY",
      severity: metrics.p95LatencyMs >= 5000 ? "CRITICAL" : "WARNING",
      value: metrics.p95LatencyMs,
      threshold: SLO.maxP95LatencyMs,
      message: "P95 latency exceeded configured SLO.",
    });
  if (metrics.faithfulness > 0 && metrics.faithfulness < SLO.minFaithfulness)
    alerts.push({
      type: "QUALITY_DEGRADATION",
      severity: "WARNING",
      value: metrics.faithfulness,
      threshold: SLO.minFaithfulness,
      message: "Faithfulness dropped below configured SLO.",
    });
  if (metrics.recallAt5 > 0 && metrics.recallAt5 < SLO.minRecallAt5)
    alerts.push({
      type: "RETRIEVAL_DEGRADATION",
      severity: "WARNING",
      value: metrics.recallAt5,
      threshold: SLO.minRecallAt5,
      message: "Recall@5 dropped below configured SLO.",
    });
  if (metrics.requests > 0) {
    const costPerRequest = metrics.estimatedCost / metrics.requests;
    if (costPerRequest > SLO.maxCostPerRequest)
      alerts.push({
        type: "COST_SPIKE",
        severity: "WARNING",
        value: costPerRequest,
        threshold: SLO.maxCostPerRequest,
        message: "Average cost per request exceeded SLO.",
      });
  }
  if (metrics.contextTokens > SLO.maxContextTokens)
    alerts.push({
      type: "TOKEN_SPIKE",
      severity: "WARNING",
      value: metrics.contextTokens,
      threshold: SLO.maxContextTokens,
      message: "Context token usage exceeded configured limit.",
    });
  return alerts;
}
