export function checkToolRisk(tool) {
  if (tool.risk === "high") {
    return {
      allowed: false,
      requiresApproval: true,
      reason: "High-risk tool requires human approval",
    };
  }

  return {
    allowed: true,
    requiresApproval: false,
  };
}
