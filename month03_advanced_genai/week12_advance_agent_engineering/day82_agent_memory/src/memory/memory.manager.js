import { ShortTermMemory } from "./short.term.memory.js";
import { SemanticMemory } from "./semantic.memory.js";
import { EpisodicMemory } from "./episodic.memory.js";
import { MemoryRetriever } from "./memory.retriever.js";
import { MemoryConsolidator } from "./memory.consolidator.js";
import { validateMemory } from "./memory.validator.js";

export class MemoryManager {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;

    this.shortTerm = new ShortTermMemory(20);

    this.semantic = new SemanticMemory(memoryStore);

    this.episodic = new EpisodicMemory(memoryStore);

    this.retriever = new MemoryRetriever(memoryStore);

    this.consolidator = new MemoryConsolidator(memoryStore);
  }

  addConversation(message) {
    this.shortTerm.add(message);
  }

  getConversation() {
    return this.shortTerm.getAll();
  }

  remember(userId, memory) {
    const validation = validateMemory(memory);

    if (!validation.valid) {
      return {
        saved: false,
        reason: validation.reason,
      };
    }

    const result = this.consolidator.saveOrUpdate(userId, memory);

    return {
      saved: true,
      ...result,
    };
  }

  retrieve(userId, query, limit = 5) {
    this.memoryStore.cleanupExpired(userId);

    return this.retriever.search(userId, query, limit);
  }

  getAll(userId) {
    return this.memoryStore.get(userId);
  }

  delete(userId, memoryId) {
    return this.memoryStore.delete(userId, memoryId);
  }

  clear(userId) {
    this.memoryStore.clear(userId);
  }

  clearConversation() {
    this.shortTerm.clear();
  }
}
