import test from "node:test";
import assert from "node:assert/strict";
import { createRequestId } from "../src/infrastructure/observability/request-id.js";
import { createTrace } from "../src/infrastructure/observability/tracer.js";
import { calculateCost } from "../src/infrastructure/observability/cost.js";

test("request IDs are unique and prefixed", () => {
  const a = createRequestId();
  const b = createRequestId();

  assert.notEqual(a, b);
  assert.match(a, /^req_/);
});

test("trace records span duration", () => {
  const trace = createTrace("req_test");
  const span = trace.startSpan("retrieval");
  span.end({ resultCount: 5 });

  const result = trace.finish();

  assert.equal(result.requestId, "req_test");
  assert.equal(result.spans.length, 1);
  assert.equal(result.spans[0].name, "retrieval");
  assert.equal(result.spans[0].resultCount, 5);
  assert.ok(result.spans[0].durationMs >= 0);
});

test("cost calculation works", () => {
  const cost = calculateCost({
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
    inputPricePerMillion: 0.075,
    outputPricePerMillion: 0.3,
  });

  assert.equal(cost, 0.375);
});
