import { MemoryManager } from "../memory/memory.manager.js";
import { memoryStore } from "../storage/memory.store.js";
import { generateResponse } from "../services/llm.service.js";
import { extractMemories } from "../memory/memory.extractor.js";
import { buildMemoryContext } from "../memory/context.builder.js";

export class MemoryAgent {
  constructor() {
    this.memoryManager = new MemoryManager(memoryStore);
  }

  async chat(userId, message) {
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!message || !message.trim()) {
      throw new Error("message is required");
    }

    // 1. Retrieve relevant long-term memory
    const relevantMemories = this.memoryManager.retrieve(userId, message, 5);

    // 2. Build memory context
    const memoryContext = buildMemoryContext(relevantMemories);

    // 3. Get recent conversation
    const conversation = this.memoryManager.getConversation();

    // 4. Generate LLM response
    const response = await generateResponse({
      userMessage: message,
      conversation,
      memoryContext,
    });

    // 5. Add current conversation
    this.memoryManager.addConversation({
      role: "user",
      content: message,
    });

    this.memoryManager.addConversation({
      role: "assistant",
      content: response,
    });

    // 6. Extract candidate memories
    let extracted = [];

    try {
      const result = await extractMemories({
        userMessage: message,
        assistantResponse: response,
      });

      extracted = result.memories || [];
    } catch (error) {
      console.error("Memory extraction failed:", error.message);
    }

    // 7. Validate and store
    const storedMemories = [];

    for (const candidate of extracted) {
      const result = this.memoryManager.remember(userId, {
        ...candidate,
        source: "conversation",
      });

      if (result.saved) {
        storedMemories.push(result.memory);
      }
    }

    return {
      response,
      memoriesUsed: relevantMemories.length,
      memoriesStored: storedMemories.length,
      memories: storedMemories,
    };
  }
}
