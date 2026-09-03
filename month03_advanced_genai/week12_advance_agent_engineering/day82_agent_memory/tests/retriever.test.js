import test from "node:test";
import assert from "node:assert/strict";

import { LongTermMemory } from "../src/memory/long.term.memory.js";
import { MemoryRetriever } from "../src/memory/memory.retriever.js";

test("retriever finds relevant memory", () => {
  const memoryStore = new LongTermMemory();

  memoryStore.save("user123", {
    type: "preference",
    content: "User prefers Node.js",
    importance: 0.9,
  });

  memoryStore.save("user123", {
    type: "fact",
    content: "User is learning Docker",
    importance: 0.7,
  });

  const retriever = new MemoryRetriever(memoryStore);

  const results = retriever.search("user123", "Node.js", 1);

  assert.equal(results.length, 1);

  assert.equal(results[0].content, "User prefers Node.js");
});
