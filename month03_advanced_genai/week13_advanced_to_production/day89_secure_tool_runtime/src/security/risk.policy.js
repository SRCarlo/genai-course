export const riskPolicy = {
  LOW: {
    approvalRequired: false
  },

  MEDIUM: {
    approvalRequired: false
  },

  HIGH: {
    approvalRequired: true
  },

  CRITICAL: {
    approvalRequired: true
  }
};

export function getRiskPolicy(risk) {
  return riskPolicy[risk] ?? null;
}