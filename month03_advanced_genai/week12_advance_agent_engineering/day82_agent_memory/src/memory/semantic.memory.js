import { MEMORY_TYPES } from "./memory.types.js";

export class SemanticMemory {
  constructor(longTermMemory) {
    this.longTermMemory = longTermMemory;
  }

  saveFact(userId, content, importance = 0.7) {
    return this.longTermMemory.save(userId, {
      type: MEMORY_TYPES.FACT,
      content,
      importance,
      source: "conversation",
    });
  }

  savePreference(userId, content, importance = 0.8) {
    return this.longTermMemory.save(userId, {
      type: MEMORY_TYPES.PREFERENCE,
      content,
      importance,
      source: "conversation",
    });
  }

  saveGoal(userId, content, importance = 0.9) {
    return this.longTermMemory.save(userId, {
      type: MEMORY_TYPES.GOAL,
      content,
      importance,
      source: "conversation",
    });
  }

  get(userId) {
    return this.longTermMemory
      .get(userId)
      .filter((memory) =>
        [
          MEMORY_TYPES.FACT,
          MEMORY_TYPES.PREFERENCE,
          MEMORY_TYPES.GOAL,
        ].includes(memory.type),
      );
  }
}
