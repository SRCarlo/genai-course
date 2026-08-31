export class LongTermMemory {
  constructor(store) {
    this.store = store;
  }

  async remember(memory) {
    return this.store.save(memory);
  }

  async get(memoryId) {
    return this.store.get(memoryId);
  }

  async getUserMemories(userId, tenantId = null) {
    return this.store.getAll(userId, tenantId);
  }

  async search(userId, query, tenantId = null) {
    return this.store.search(userId, query, tenantId);
  }

  async update(memoryId, data) {
    return this.store.update(memoryId, data);
  }

  async forget(memoryId) {
    return this.store.delete(memoryId);
  }

  async forgetUser(userId, tenantId = null) {
    return this.store.deleteByUser(userId, tenantId);
  }
}
