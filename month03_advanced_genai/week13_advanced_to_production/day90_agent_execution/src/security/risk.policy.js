const highRiskTools = new Set(["refundOrder"]);

export function getRiskLevel(toolName) {
  if (highRiskTools.has(toolName)) {
    return "high";
  }

  return "low";
}

export function requiresHumanApproval(toolName) {
  return getRiskLevel(toolName) === "high";
}
