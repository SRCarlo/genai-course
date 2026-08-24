import test from "node:test";

import assert from "node:assert/strict";

import { withSpan, getTracer } from "../src/services/tracing.service.js";

test("tracer is available", () => {
  const tracer = getTracer();

  assert.ok(tracer);
});

test("withSpan returns operation result", async () => {
  const result = await withSpan(
    "test.span",
    {
      "test.attribute": "value",
    },
    async () => {
      return {
        success: true,
      };
    },
  );

  assert.deepEqual(result, {
    success: true,
  });
});

test("withSpan propagates errors", async () => {
  await assert.rejects(
    async () => {
      await withSpan("test.error", {}, async () => {
        throw new Error("test failure");
      });
    },
    {
      message: "test failure",
    },
  );
});
