import "dotenv/config";

import test from "node:test";
import assert from "node:assert/strict";

import { rerank } from "../src/rag/reranker.js";

test("reranker returns final K documents", async () => {
  const documents = [
    {
      id: "doc1",
      title: "HTTP Errors",
      content: "HTTP 429 Too Many Requests",
    },
    {
      id: "doc2",
      title: "Random",
      content: "JavaScript programming",
    },
  ];

  const result = await rerank("What is HTTP 429?", documents, {
    finalK: 1,
  });

  assert.equal(result.length, 1);

  assert.ok(result[0].rerankScore !== undefined);
});
