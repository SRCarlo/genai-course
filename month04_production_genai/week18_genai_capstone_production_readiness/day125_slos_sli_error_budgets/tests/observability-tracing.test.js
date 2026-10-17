import test from "node:test";
import assert from "node:assert/strict";
import { traceRetrieval, traceGeneration } from "../src/observability/chat-tracing.js";

test("retrieval tracing returns the operation result", async () => {
  const result = [{ id: "doc-1" }];
  assert.equal(await traceRetrieval(async () => result), result);
});

test("retrieval tracing rethrows errors", async () => {
  await assert.rejects(
    traceRetrieval(async () => { throw new Error("retrieval failed"); }),
    /retrieval failed/,
  );
});

test("generation tracing returns the operation result", async () => {
  const result = { answer: "test", model: "test-model", usage: { inputTokens: 3, outputTokens: 2, totalTokens: 5 } };
  assert.equal(await traceGeneration(async () => result), result);
});
