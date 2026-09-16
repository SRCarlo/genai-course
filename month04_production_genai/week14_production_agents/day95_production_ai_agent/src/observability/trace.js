import { randomUUID } from "node:crypto";

export function createTrace() {
  return {
    traceId: `trace-${randomUUID()}`,
    status: "running",
    startedAt: Date.now(),
    durationMs: null,
    spans: []
  };
}

export function startSpan(trace, name, attributes = {}) {
  const span = {
    id: `span-${randomUUID()}`,
    name,
    startedAt: Date.now(),
    durationMs: null,
    status: "running",
    attributes
  };

  trace.spans.push(span);
  return span;
}

export function endSpan(span, status = "success", attributes = {}) {
  span.durationMs = Date.now() - span.startedAt;
  span.status = status;
  span.attributes = { ...span.attributes, ...attributes };
  return span;
}

export function finishTrace(trace, status = "success") {
  trace.durationMs = Date.now() - trace.startedAt;
  trace.status = status;
  return trace;
}
