export const RISK_LEVELS = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
});

export const toolRisk = Object.freeze({
  searchOrders: RISK_LEVELS.LOW,
  getCustomer: RISK_LEVELS.LOW,
  refundOrder: RISK_LEVELS.HIGH,
  deleteCustomer: RISK_LEVELS.CRITICAL
});

export function getRiskLevel(toolName) {
  return toolRisk[toolName] ?? RISK_LEVELS.CRITICAL;
}

export function requiresHumanApproval(risk) {
  return risk === RISK_LEVELS.HIGH || risk === RISK_LEVELS.CRITICAL;
}
