import { MemoryStore } from "../src/memory/memory.store.js";

import { writeMemory } from "../src/memory/memory.writer.js";

import { retrieveMemories } from "../src/memory/memory.retriever.js";

describe("Memory Retrieval", () => {
  test("should retrieve relevant memory", async () => {
    const store = new MemoryStore();

    await writeMemory(store, {
      userId: "user_001",

      type: "preference",

      content: "User prefers PostgreSQL.",

      importance: 0.9,
    });

    await writeMemory(store, {
      userId: "user_001",

      type: "preference",

      content: "User likes dark mode.",

      importance: 0.3,
    });

    const memories = await retrieveMemories(store, {
      userId: "user_001",

      query: "Which database should I use?",

      limit: 5,
    });

    expect(memories.length).toBeGreaterThan(0);

    expect(memories[0].content).toContain("PostgreSQL");
  });

  test("should not return another user's memory", async () => {
    const store = new MemoryStore();

    await writeMemory(store, {
      userId: "user_A",

      type: "preference",

      content: "User A uses PostgreSQL.",
    });

    await writeMemory(store, {
      userId: "user_B",

      type: "preference",

      content: "User B uses MongoDB.",
    });

    const memories = await retrieveMemories(store, {
      userId: "user_A",

      query: "database",

      limit: 5,
    });

    expect(memories.every((memory) => memory.userId === "user_A")).toBe(true);
  });
});
