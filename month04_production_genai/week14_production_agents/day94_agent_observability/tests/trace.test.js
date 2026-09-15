import test from "node:test";
import assert from "node:assert/strict";
import { createTrace, endTrace } from "../src/observability/trace.js";

test("createTrace creates a trace id and empty spans", () => {
  const trace = createTrace();
  assert.match(trace.traceId, /^trace_/);
  assert.equal(trace.status, "running");
  assert.deepEqual(trace.spans, []);
});

test("endTrace records duration and status", () => {
  const trace = createTrace();
  endTrace(trace, "success");

  assert.equal(trace.status, "success");
  assert.equal(typeof trace.durationMs, "number");
  assert.ok(trace.durationMs >= 0);
});
