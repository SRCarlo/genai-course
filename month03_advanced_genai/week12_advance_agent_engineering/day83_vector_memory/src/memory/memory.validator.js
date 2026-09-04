const ALLOWED_TYPES = [
  "preference",
  "fact",
  "event",
  "goal",
  "project",
  "skill",
  "other",
];

export function validateMemory(memory) {
  if (!memory) {
    throw new Error("Memory is required");
  }

  if (!memory.userId) {
    throw new Error("userId is required");
  }

  if (!memory.content) {
    throw new Error("Memory content is required");
  }

  if (memory.type && !ALLOWED_TYPES.includes(memory.type)) {
    throw new Error(`Invalid memory type: ${memory.type}`);
  }

  if (
    memory.importance !== undefined &&
    (memory.importance < 0 || memory.importance > 1)
  ) {
    throw new Error("importance must be between 0 and 1");
  }

  return true;
}
