import { MEMORY_TYPES } from "./memory.types.js";

export class EpisodicMemory {
  constructor(longTermMemory) {
    this.longTermMemory = longTermMemory;
  }

  record(userId, event, importance = 0.7) {
    return this.longTermMemory.save(userId, {
      type: MEMORY_TYPES.EVENT,
      content: event,
      importance,
      source: "conversation",
    });
  }

  getEvents(userId) {
    return this.longTermMemory
      .get(userId)
      .filter((memory) => memory.type === MEMORY_TYPES.EVENT);
  }
}
