const allowedTools = {
  knowledge_search: {
    enabled: true,
    risk: "low",
    requiresApproval: false,
  },

  calculator: {
    enabled: true,
    risk: "low",
    requiresApproval: false,
  },

  send_email: {
    enabled: false,
    risk: "high",
    requiresApproval: true,
  },

  delete_user: {
    enabled: false,
    risk: "critical",
    requiresApproval: true,
  },

  update_account: {
    enabled: false,
    risk: "high",
    requiresApproval: true,
  },
};

export function isToolAllowed(toolName) {
  return Boolean(allowedTools[toolName]?.enabled);
}

export function getToolPolicy(toolName) {
  return allowedTools[toolName] || null;
}

export function requiresHumanApproval(toolName) {
  return Boolean(allowedTools[toolName]?.requiresApproval);
}

export function getAllowedTools() {
  return Object.entries(allowedTools)
    .filter(([, policy]) => policy.enabled)
    .map(([name]) => name);
}

export { allowedTools };
