export function checkToolGuard(tool, context = {}) {
  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (tool.risk === "high") {
    if (!context.approved) {
      return {
        allowed: false,
        requiresApproval: true,
      };
    }
  }

  return {
    allowed: true,
    requiresApproval: false,
  };
}
