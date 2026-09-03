import crypto from "node:crypto";

export class LongTermMemory {
  constructor() {
    this.memories = new Map();
  }

  save(userId, memory) {
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!memory || !memory.content) {
      throw new Error("Memory content is required");
    }

    if (!this.memories.has(userId)) {
      this.memories.set(userId, []);
    }

    const now = new Date().toISOString();

    const record = {
      id: memory.id || crypto.randomUUID(),
      userId,
      type: memory.type || "fact",
      content: memory.content,
      importance:
        typeof memory.importance === "number" ? memory.importance : 0.5,
      source: memory.source || "conversation",
      createdAt: memory.createdAt || now,
      updatedAt: now,
      expiresAt: memory.expiresAt || null,
    };

    this.memories.get(userId).push(record);

    return record;
  }

  get(userId) {
    return [...(this.memories.get(userId) || [])];
  }

  getById(userId, memoryId) {
    return this.get(userId).find((memory) => memory.id === memoryId);
  }

  delete(userId, memoryId) {
    const userMemories = this.memories.get(userId) || [];

    const filtered = userMemories.filter((memory) => memory.id !== memoryId);

    this.memories.set(userId, filtered);

    return filtered.length !== userMemories.length;
  }

  clear(userId) {
    this.memories.delete(userId);
  }

  update(userId, memoryId, updates) {
    const userMemories = this.memories.get(userId) || [];

    const index = userMemories.findIndex((memory) => memory.id === memoryId);

    if (index === -1) {
      return null;
    }

    userMemories[index] = {
      ...userMemories[index],
      ...updates,
      id: memoryId,
      userId,
      updatedAt: new Date().toISOString(),
    };

    return userMemories[index];
  }

  cleanupExpired(userId) {
    const memories = this.get(userId);

    const now = Date.now();

    const validMemories = memories.filter((memory) => {
      if (!memory.expiresAt) {
        return true;
      }

      return new Date(memory.expiresAt).getTime() > now;
    });

    this.memories.set(userId, validMemories);

    return memories.length - validMemories.length;
  }
}
