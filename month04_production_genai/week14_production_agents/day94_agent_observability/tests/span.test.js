import test from "node:test";
import assert from "node:assert/strict";
import { createTrace } from "../src/observability/trace.js";
import { startSpan, endSpan } from "../src/observability/span.js";

test("span lifecycle records duration and status", async () => {
  const trace = createTrace();
  const span = startSpan(trace, "tool.search", { spanType: "tool" });

  await new Promise(resolve => setTimeout(resolve, 5));
  endSpan(span, "success");

  assert.equal(trace.spans.length, 1);
  assert.equal(span.status, "success");
  assert.ok(span.durationMs >= 0);
  assert.equal(span.attributes.spanType, "tool");
});
