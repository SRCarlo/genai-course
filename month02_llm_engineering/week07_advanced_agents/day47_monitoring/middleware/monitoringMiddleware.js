import { trackRequest, trackLatency } from "../monitoring/metrics.js";

import { startTrace, addTraceStep } from "../tracing/traceManager.js";

export function monitoringMiddleware(req, res, next) {
  const start = Date.now();

  trackRequest();

  const traceId = startTrace();

  req.traceId = traceId;

  addTraceStep(traceId, "API Request Started");

  res.on("finish", () => {
    const latency = Date.now() - start;

    trackLatency(latency);

    addTraceStep(traceId, "API Response Completed");
  });

  next();
}
