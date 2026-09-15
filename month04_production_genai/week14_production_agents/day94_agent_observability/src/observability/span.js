import crypto from "node:crypto";

export function startSpan(trace, name, attributes = {}) {
  const span = {
    spanId: `span_${crypto.randomUUID()}`,
    traceId: trace.traceId,
    name,
    attributes,
    startedAt: Date.now(),
    endedAt: null,
    durationMs: null,
    status: "running",
    error: null
  };

  trace.spans.push(span);
  return span;
}

export function endSpan(span, status = "success", extra = {}) {
  span.endedAt = Date.now();
  span.durationMs = span.endedAt - span.startedAt;
  span.status = status;
  Object.assign(span, extra);
  return span;
}
