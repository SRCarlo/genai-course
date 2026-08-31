import crypto from "node:crypto";
import { MEMORY_TYPES, VALID_MEMORY_TYPES } from "./memory.types.js";

export async function writeMemory(
  store,
  {
    userId,
    tenantId = "default",
    type = MEMORY_TYPES.SEMANTIC,
    content,
    importance = 0.5,
    source = "user",
    expiresAt = null,
  },
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!content || !content.trim()) {
    throw new Error("Memory content is required");
  }

  if (!VALID_MEMORY_TYPES.includes(type)) {
    throw new Error(`Invalid memory type: ${type}`);
  }

  if (typeof importance !== "number" || importance < 0 || importance > 1) {
    throw new Error("Importance must be between 0 and 1");
  }

  const now = new Date().toISOString();

  const memory = {
    id: `mem_${crypto.randomUUID()}`,

    tenantId,

    userId,

    type,

    content: content.trim(),

    importance,

    source,

    createdAt: now,

    updatedAt: now,

    lastAccessedAt: null,

    expiresAt,
  };

  return store.save(memory);
}
