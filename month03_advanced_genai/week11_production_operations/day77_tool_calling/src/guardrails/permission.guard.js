export function authorizeTool({ tool, userRole }) {
  if (!tool.permissions.includes(userRole)) {
    return {
      allowed: false,
      reason: "User is not authorized to use this tool",
    };
  }

  return {
    allowed: true,
  };
}
