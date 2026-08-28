const USER_PERMISSIONS = ["knowledge:read", "calculator:use", "orders:read"];

export function validateToolCall(toolName, argumentsObject, tool) {
  if (!tool) {
    return {
      allowed: false,
      reason: "Unknown tool.",
    };
  }

  for (const permission of tool.permissions) {
    if (!USER_PERMISSIONS.includes(permission)) {
      return {
        allowed: false,
        reason: `Permission denied: ${permission}`,
      };
    }
  }

  if (!argumentsObject || typeof argumentsObject !== "object") {
    return {
      allowed: false,
      reason: "Invalid tool arguments.",
    };
  }

  return {
    allowed: true,
  };
}
