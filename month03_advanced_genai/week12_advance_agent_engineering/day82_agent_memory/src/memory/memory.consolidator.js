export class MemoryConsolidator {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }

  findDuplicate(userId, candidate) {
    const memories = this.memoryStore.get(userId);

    const normalizedCandidate = candidate.content.toLowerCase().trim();

    return memories.find((memory) => {
      const normalizedExisting = memory.content.toLowerCase().trim();

      return (
        memory.type === candidate.type &&
        normalizedExisting === normalizedCandidate
      );
    });
  }

  saveOrUpdate(userId, candidate) {
    const duplicate = this.findDuplicate(userId, candidate);

    if (duplicate) {
      return {
        action: "updated",
        memory: this.memoryStore.update(userId, duplicate.id, {
          importance: Math.max(duplicate.importance, candidate.importance),
        }),
      };
    }

    return {
      action: "created",
      memory: this.memoryStore.save(userId, candidate),
    };
  }
}
