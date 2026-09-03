import { MEMORY_TYPES, MEMORY_SOURCES } from "./memory.types.js";

const ALLOWED_TYPES = new Set(Object.values(MEMORY_TYPES));

const ALLOWED_SOURCES = new Set(Object.values(MEMORY_SOURCES));

const SENSITIVE_PATTERNS = [
  /password\s*[:=]/i,
  /api[_-]?key\s*[:=]/i,
  /access[_-]?token\s*[:=]/i,
  /secret\s*[:=]/i,
  /bearer\s+[a-z0-9._-]+/i,
  /credit\s*card/i,
];

export function validateMemory(memory) {
  if (!memory || typeof memory !== "object") {
    return {
      valid: false,
      reason: "Memory must be an object",
    };
  }

  if (!ALLOWED_TYPES.has(memory.type)) {
    return {
      valid: false,
      reason: "Invalid memory type",
    };
  }

  if (
    typeof memory.content !== "string" ||
    memory.content.trim().length === 0
  ) {
    return {
      valid: false,
      reason: "Memory content is required",
    };
  }

  if (memory.content.length > 1000) {
    return {
      valid: false,
      reason: "Memory content is too long",
    };
  }

  if (memory.source && !ALLOWED_SOURCES.has(memory.source)) {
    return {
      valid: false,
      reason: "Invalid memory source",
    };
  }

  if (
    typeof memory.importance !== "number" ||
    memory.importance < 0 ||
    memory.importance > 1
  ) {
    return {
      valid: false,
      reason: "Importance must be between 0 and 1",
    };
  }

  const sensitive = SENSITIVE_PATTERNS.some((pattern) =>
    pattern.test(memory.content),
  );

  if (sensitive) {
    return {
      valid: false,
      reason: "Potentially sensitive information",
    };
  }

  return {
    valid: true,
    memory,
  };
}
