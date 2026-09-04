import crypto from "node:crypto";

import { validateMemory } from "./memory.validator.js";

export class VectorMemoryManager {
  constructor(embeddingService, vectorStore) {
    this.embeddingService = embeddingService;

    this.vectorStore = vectorStore;
  }

  async save(memory) {
    validateMemory(memory);

    const embedding = await this.embeddingService.embed(memory.content);

    const record = {
      id: memory.id || `mem_${crypto.randomUUID()}`,

      userId: memory.userId,

      type: memory.type || "other",

      content: memory.content,

      importance: memory.importance ?? 0.5,

      metadata: memory.metadata || {},

      embedding,

      createdAt: new Date().toISOString(),
    };

    return this.vectorStore.add(record);
  }

  async update(id, updates) {
    let finalUpdates = {
      ...updates,
    };

    if (updates.content) {
      finalUpdates.embedding = await this.embeddingService.embed(
        updates.content,
      );
    }

    return this.vectorStore.update(id, finalUpdates);
  }

  getAll() {
    return this.vectorStore.getAll();
  }

  getById(id) {
    return this.vectorStore.getById(id);
  }

  delete(id) {
    return this.vectorStore.delete(id);
  }

  clear() {
    this.vectorStore.clear();
  }
}
