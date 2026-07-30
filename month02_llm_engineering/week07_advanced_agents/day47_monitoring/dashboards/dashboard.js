import { getMetrics } from "../monitoring/metrics.js";

import { getTokenMetrics } from "../monitoring/tokenTracker.js";

import { getCostMetrics } from "../monitoring/costTracker.js";

import { getTraces } from "../tracing/traceManager.js";

export function getDashboard() {
  return {
    metrics: getMetrics(),

    tokens: getTokenMetrics(),

    cost: getCostMetrics(),

    traces: getTraces(),
  };
}
