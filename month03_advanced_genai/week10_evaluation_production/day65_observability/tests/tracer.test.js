import test from "node:test";
import assert from "node:assert/strict";

import {
  createTrace,
  startSpan,
  endSpan,
  recordSpanError,
  finishTrace,
} from "../observability/tracer.js";

test("creates a trace", () => {
  const trace = createTrace();

  assert.ok(trace.traceId);

  assert.equal(trace.status, "running");

  assert.ok(Array.isArray(trace.spans));
});

test("creates a span", () => {
  const trace = createTrace();

  const span = startSpan(trace, "llm.call", {
    model: "test-model",
  });

  assert.ok(span.spanId);

  assert.equal(span.name, "llm.call");

  assert.equal(trace.spans.length, 1);
});

test("completes a span and calculates duration", async () => {
  const trace = createTrace();

  const span = startSpan(trace, "test.operation");

  await new Promise((resolve) => setTimeout(resolve, 10));

  endSpan(span);

  assert.equal(span.status, "success");

  assert.ok(span.durationMs >= 10);

  assert.ok(span.endedAt);
});

test("captures span error", () => {
  const trace = createTrace();

  const span = startSpan(trace, "vector.search");

  const testError = new Error("Vector database failed");

  recordSpanError(span, testError);

  assert.equal(span.status, "error");

  assert.equal(span.attributes.error, "Vector database failed");

  assert.equal(span.attributes.errorType, "Error");
});

test("finishes trace", () => {
  const trace = createTrace();

  finishTrace(trace, "success");

  assert.equal(trace.status, "success");

  assert.ok(trace.endedAt);

  assert.ok(trace.latencyMs >= 0);
});
