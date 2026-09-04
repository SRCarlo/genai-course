import test from "node:test";
import assert from "node:assert/strict";

import { EmbeddingService } from "../src/embeddings/embedding.service.js";

import { VectorMemoryStore } from "../src/storage/vector.memory.store.js";

import { VectorMemoryManager } from "../src/memory/vector.memory.manager.js";

test("memory can be saved", async () => {
  const embeddingService = new EmbeddingService();

  const store = new VectorMemoryStore();

  const manager = new VectorMemoryManager(embeddingService, store);

  const memory = await manager.save({
    userId: "user123",
    type: "preference",
    content: "User prefers Node.js",
    importance: 0.9,
  });

  assert.ok(memory.id);
  assert.equal(memory.userId, "user123");

  assert.ok(Array.isArray(memory.embedding));

  assert.equal(store.count(), 1);
});

test("memory can be deleted", async () => {
  const embeddingService = new EmbeddingService();

  const store = new VectorMemoryStore();

  const manager = new VectorMemoryManager(embeddingService, store);

  const memory = await manager.save({
    userId: "user123",
    type: "fact",
    content: "User is learning Node.js",
    importance: 0.7,
  });

  const deleted = manager.delete(memory.id);

  assert.equal(deleted, true);

  assert.equal(store.count(), 0);
});
