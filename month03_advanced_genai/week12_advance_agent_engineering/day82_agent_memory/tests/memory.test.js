import test from "node:test";
import assert from "node:assert/strict";

import { ShortTermMemory } from "../src/memory/short.term.memory.js";
import { LongTermMemory } from "../src/memory/long.term.memory.js";

test("short-term memory stores messages", () => {
  const memory = new ShortTermMemory();

  memory.add({
    role: "user",
    content: "Hello",
  });

  assert.equal(memory.getAll().length, 1);

  assert.equal(memory.getAll()[0].content, "Hello");
});

test("short-term memory can be cleared", () => {
  const memory = new ShortTermMemory();

  memory.add({
    role: "user",
    content: "Hello",
  });

  memory.clear();

  assert.equal(memory.getAll().length, 0);
});

test("long-term memory is isolated by user", () => {
  const memory = new LongTermMemory();

  memory.save("user1", {
    type: "preference",
    content: "Node.js",
    importance: 0.9,
  });

  memory.save("user2", {
    type: "preference",
    content: "Python",
    importance: 0.9,
  });

  assert.equal(memory.get("user1").length, 1);

  assert.equal(memory.get("user2").length, 1);

  assert.equal(memory.get("user1")[0].content, "Node.js");
});

test("long-term memory can delete memory", () => {
  const memory = new LongTermMemory();

  const saved = memory.save("user1", {
    type: "fact",
    content: "Uses PostgreSQL",
    importance: 0.7,
  });

  const deleted = memory.delete("user1", saved.id);

  assert.equal(deleted, true);

  assert.equal(memory.get("user1").length, 0);
});
