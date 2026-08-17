import crypto from "crypto";

export function createTrace() {
  return {
    traceId: `trace_${crypto.randomUUID()}`,

    startedAt: Date.now(),

    endedAt: null,

    latencyMs: 0,

    status: "running",

    spans: [],

    summary: {
      llmCalls: 0,

      toolCalls: 0,

      ragCalls: 0,

      inputTokens: 0,

      outputTokens: 0,

      totalTokens: 0,

      estimatedCost: 0,
    },
  };
}

export function startSpan(trace, name, attributes = {}, parentSpanId = null) {
  if (!trace) {
    throw new Error("Trace is required");
  }

  const span = {
    spanId: crypto.randomUUID(),

    parentSpanId,

    name,

    startedAt: Date.now(),

    endedAt: null,

    durationMs: null,

    status: "running",

    attributes,
  };

  trace.spans.push(span);

  return span;
}

export function endSpan(span, status = "success") {
  if (!span) {
    throw new Error("Span is required");
  }

  span.endedAt = Date.now();

  span.durationMs = span.endedAt - span.startedAt;

  span.status = status;

  return span;
}

export function recordSpanError(span, error) {
  if (!span) {
    throw new Error("Span is required");
  }

  span.attributes = {
    ...span.attributes,

    error: error?.message || "Unknown error",

    errorType: error?.constructor?.name || "Error",
  };

  endSpan(span, "error");

  return span;
}

export function finishTrace(trace, status = "success") {
  if (!trace) {
    throw new Error("Trace is required");
  }

  trace.endedAt = Date.now();

  trace.latencyMs = trace.endedAt - trace.startedAt;

  trace.status = status;

  return trace;
}
