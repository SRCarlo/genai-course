import { env } from "../config/env.js";

import { getMetrics } from "./metrics.service.js";

import { logger } from "../middleware/logger.js";

export function evaluateAlerts() {
  const metrics = getMetrics();

  const alerts = [];

  if (metrics.requests.errorRatePercent > env.errorRateAlertPercent) {
    alerts.push({
      severity: "high",
      type: "api_error_rate",
      message: `API error rate is ${metrics.requests.errorRatePercent}%`,
    });
  }

  if (metrics.ai.latency.p95 > env.p95LatencyAlertMs) {
    alerts.push({
      severity: "high",
      type: "ai_p95_latency",
      message: `AI p95 latency is ${metrics.ai.latency.p95}ms`,
    });
  }

  if (metrics.ai.costUsd > env.dailyCostAlertUsd) {
    alerts.push({
      severity: "critical",
      type: "ai_cost",
      message: `AI cost is $${metrics.ai.costUsd}`,
    });
  }

  if (metrics.ai.errorRatePercent > env.errorRateAlertPercent) {
    alerts.push({
      severity: "high",
      type: "ai_error_rate",
      message: `AI error rate is ${metrics.ai.errorRatePercent}%`,
    });
  }

  for (const alert of alerts) {
    logger.warn("Observability alert triggered", alert);
  }

  return alerts;
}
