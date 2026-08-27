import "dotenv/config";

import test from "node:test";
import assert from "node:assert/strict";

import { advancedRAG } from "../src/rag/pipeline.js";

test("advanced RAG returns answer and sources", async () => {
  if (!process.env.GROQ_API_KEY) {
    console.log("Skipping live Groq test because GROQ_API_KEY is missing.");

    return;
  }

  const result = await advancedRAG("What is HTTP 429?", {
    topK: 5,
    finalK: 2,
    metadataFilter: {
      tenantId: "tenant_1",
    },
  });

  assert.equal(typeof result.answer, "string");

  assert.ok(Array.isArray(result.sources));

  assert.ok(result.trace);
});
