import "dotenv/config";

import test from "node:test";
import assert from "node:assert/strict";

import { retrieve } from "../src/rag/retriever.js";

import { hybridSearch } from "../src/rag/hybrid-search.js";

test("vector retriever returns documents", async () => {
  const results = await retrieve("Node.js performance", {
    topK: 3,
  });

  assert.ok(Array.isArray(results));

  assert.ok(results.length > 0);
});

test("hybrid search returns fused results", async () => {
  const result = await hybridSearch("HTTP 429", {
    topK: 5,
  });

  assert.ok(Array.isArray(result.vectorResults));

  assert.ok(Array.isArray(result.keywordResults));

  assert.ok(Array.isArray(result.fusedResults));

  assert.ok(result.fusedResults.length > 0);
});

test("keyword search handles exact error codes", async () => {
  const result = await hybridSearch("PostgreSQL 23505", {
    topK: 5,
  });

  const ids = result.fusedResults.map((doc) => doc.id);

  assert.ok(ids.includes("doc_postgres_errors"));
});
