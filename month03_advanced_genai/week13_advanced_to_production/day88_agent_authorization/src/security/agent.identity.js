export function createAgentIdentity({
  agentId,
  agentType,
  permissions = []
}) {
  if (!agentId || !agentType) {
    throw new Error("INVALID_AGENT_IDENTITY");
  }

  return Object.freeze({
    agentId,
    agentType,
    permissions: [...permissions],
    createdAt: new Date().toISOString()
  });
}
