import { MemoryStore } from "../src/memory/memory.store.js";

import { writeMemory } from "../src/memory/memory.writer.js";

describe("Memory Store", () => {
  let store;

  beforeEach(() => {
    store = new MemoryStore();
  });

  test("should save memory", async () => {
    const memory = await writeMemory(store, {
      userId: "user_001",

      type: "preference",

      content: "User prefers PostgreSQL.",

      importance: 0.9,
    });

    expect(memory.userId).toBe("user_001");

    expect(memory.content).toBe("User prefers PostgreSQL.");
  });

  test("should isolate users", async () => {
    await writeMemory(store, {
      userId: "user_A",

      type: "preference",

      content: "Uses PostgreSQL.",
    });

    await writeMemory(store, {
      userId: "user_B",

      type: "preference",

      content: "Uses MongoDB.",
    });

    const memories = await store.getAll("user_A");

    expect(memories).toHaveLength(1);

    expect(memories[0].content).toContain("PostgreSQL");
  });

  test("should delete memory", async () => {
    const memory = await writeMemory(store, {
      userId: "user_001",

      type: "semantic",

      content: "Temporary fact.",
    });

    const deleted = await store.delete(memory.id);

    expect(deleted).toBe(true);

    const result = await store.get(memory.id);

    expect(result).toBeNull();
  });
});
