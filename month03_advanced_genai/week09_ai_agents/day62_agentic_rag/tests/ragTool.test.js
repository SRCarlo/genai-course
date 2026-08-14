import test from "node:test";
import assert from "node:assert/strict";

import { buildContext } from "../backend/rag/contextBuilder.js";

test("context builder creates source context", () => {
  const results = [
    {
      title: "Refund Policy",

      content: "Refunds are available within 30 days.",

      source: "refund-policy.md",

      chunkId: "refund-001",

      score: 0.91,
    },
  ];

  const context = buildContext(results);

  assert.ok(context.includes("Refund Policy"));

  assert.ok(context.includes("refund-policy.md"));

  assert.ok(context.includes("0.910"));
});

test("context builder handles empty results", () => {
  assert.equal(buildContext([]), "");
});
