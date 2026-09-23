const allowedTools = new Set(["searchDocuments", "getUserProfile"]);

const toolSchemas = {
  searchDocuments: {
    required: ["query"],
    allowed: ["query", "limit"],
  },
  getUserProfile: {
    required: ["userId"],
    allowed: ["userId"],
  },
  deleteDocument: {
    required: ["documentId"],
    allowed: ["documentId"],
  },
};

export function isToolAllowed(toolName) {
  return allowedTools.has(toolName);
}

export function validateToolArguments(toolName, args) {
  if (!toolSchemas[toolName]) {
    return {
      valid: false,
      reason: "UNKNOWN_TOOL",
    };
  }

  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return {
      valid: false,
      reason: "INVALID_ARGUMENT_OBJECT",
    };
  }

  const schema = toolSchemas[toolName];

  for (const requiredKey of schema.required) {
    if (
      !(requiredKey in args) ||
      typeof args[requiredKey] !== "string" ||
      !args[requiredKey].trim()
    ) {
      return {
        valid: false,
        reason: `MISSING_OR_INVALID_${requiredKey.toUpperCase()}`,
      };
    }
  }

  const unexpected = Object.keys(args).filter(
    (key) => !schema.allowed.includes(key),
  );

  if (unexpected.length > 0) {
    return {
      valid: false,
      reason: "UNEXPECTED_ARGUMENTS",
      unexpected,
    };
  }

  if ("limit" in args) {
    const numericLimit = Number(args.limit);

    if (
      !Number.isInteger(numericLimit) ||
      numericLimit < 1 ||
      numericLimit > 10
    ) {
      return {
        valid: false,
        reason: "INVALID_LIMIT",
      };
    }
  }

  return { valid: true };
}
