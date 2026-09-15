import crypto from "node:crypto";

export function createTrace({ requestId = `req_${crypto.randomUUID()}`, correlationId = crypto.randomUUID() } = {}) {
  return {
    traceId: `trace_${crypto.randomUUID()}`,
    requestId,
    correlationId,
    startedAt: Date.now(),
    endedAt: null,
    durationMs: null,
    status: "running",
    spans: []
  };
}

export function endTrace(trace, status = "success") {
  trace.endedAt = Date.now();
  trace.durationMs = trace.endedAt - trace.startedAt;
  trace.status = status;
  return trace;
}
