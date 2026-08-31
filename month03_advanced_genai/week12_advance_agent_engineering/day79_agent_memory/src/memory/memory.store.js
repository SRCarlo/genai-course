export class MemoryStore {
  constructor() {
    this.memories = [];
  }

  async save(memory) {
    this.memories.push(memory);
    return memory;
  }

  async get(memoryId) {
    return this.memories.find((memory) => memory.id === memoryId) || null;
  }

  async getAll(userId, tenantId = null) {
    return this.memories.filter((memory) => {
      const userMatches = memory.userId === userId;

      const tenantMatches = tenantId === null || memory.tenantId === tenantId;

      return userMatches && tenantMatches;
    });
  }

  async search(userId, query, tenantId = null) {
    const memories = await this.getAll(userId, tenantId);

    const normalizedQuery = query.toLowerCase();

    return memories.filter((memory) =>
      memory.content.toLowerCase().includes(normalizedQuery),
    );
  }

  async update(memoryId, data) {
    const index = this.memories.findIndex((memory) => memory.id === memoryId);

    if (index === -1) {
      return null;
    }

    this.memories[index] = {
      ...this.memories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.memories[index];
  }

  async delete(memoryId) {
    const index = this.memories.findIndex((memory) => memory.id === memoryId);

    if (index === -1) {
      return false;
    }

    this.memories.splice(index, 1);

    return true;
  }

  async deleteByUser(userId, tenantId = null) {
    const before = this.memories.length;

    this.memories = this.memories.filter((memory) => {
      const userMatches = memory.userId === userId;

      const tenantMatches = tenantId === null || memory.tenantId === tenantId;

      return !(userMatches && tenantMatches);
    });

    return before - this.memories.length;
  }

  async clear() {
    this.memories = [];
  }
}
