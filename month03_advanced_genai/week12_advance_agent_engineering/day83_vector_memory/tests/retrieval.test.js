import test from "node:test";
import assert from "node:assert/strict";

import { EmbeddingService } from "../src/embeddings/embedding.service.js";

import { VectorMemoryStore } from "../src/storage/vector.memory.store.js";

import { VectorMemoryManager } from "../src/memory/vector.memory.manager.js";

import { SemanticRetriever } from "../src/memory/semantic.retriever.js";

test("retrieves top 3 memories", async () => {
  const embeddingService = new EmbeddingService();

  const store = new VectorMemoryStore();

  const manager = new VectorMemoryManager(embeddingService, store);

  const retriever = new SemanticRetriever(embeddingService, store);

  const memories = [
    "User prefers Node.js",
    "User likes JavaScript",
    "User builds backend APIs",
    "User is learning React",
    "User enjoys Python",
    "User deployed an API",
    "User studies databases",
    "User is learning AI",
    "User uses Express.js",
    "User wants to become a GenAI engineer",
  ];

  for (const content of memories) {
    await manager.save({
      userId: "user123",
      type: "fact",
      content,
      importance: 0.7,
    });
  }

  const results = await retriever.search(
    "user123",
    "What backend technology should I use?",
    {
      topK: 3,
      hybrid: true,
    },
  );

  assert.equal(results.length, 3);

  assert.ok(results.every((result) => result.userId === "user123"));
});
