import { buildMemoryContext } from "../memory/context.builder.js";

export class MemoryAgent {
  constructor({ groqService, retriever, memoryManager, deduplicator }) {
    this.groqService = groqService;

    this.retriever = retriever;

    this.memoryManager = memoryManager;

    this.deduplicator = deduplicator;
  }

  async chat({ userId, message }) {
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!message) {
      throw new Error("message is required");
    }

    // 1. Retrieve relevant memories
    const memories = await this.retriever.search(userId, message, {
      topK: 5,
      hybrid: true,
      minImportance: 0,
    });

    // 2. Build context
    const memoryContext = buildMemoryContext(memories, 8000);

    // 3. Ask Groq LLM
    const answer = await this.groqService.chat({
      system: `
You are a helpful AI assistant.

Use the supplied user memories when
they are relevant.

Do not claim a memory as fact if it
does not support the answer.

If memories are irrelevant, ignore them.

Relevant user memories:

${memoryContext}
`,
      user: message,
    });

    // 4. Extract potential memories
    const extracted = await this.groqService.extractMemories(
      `User message:
${message}

Assistant response:
${answer}`,
    );

    // 5. Validate and store memories
    const savedMemories = [];

    for (const memory of extracted.memories || []) {
      try {
        const candidate = {
          userId,
          type: memory.type || "other",
          content: memory.content,
          importance: Number(memory.importance ?? 0.5),
        };

        const duplicate = await this.deduplicator.findDuplicate(candidate);

        if (duplicate.duplicate) {
          continue;
        }

        const saved = await this.memoryManager.save(candidate);

        savedMemories.push(saved);
      } catch (error) {
        console.error("Memory save skipped:", error.message);
      }
    }

    return {
      answer,
      memoriesUsed: memories.map((memory) => ({
        id: memory.id,
        content: memory.content,
        score: memory.score,
      })),
      memoriesSaved: savedMemories.map((memory) => ({
        id: memory.id,
        type: memory.type,
        content: memory.content,
      })),
    };
  }
}
