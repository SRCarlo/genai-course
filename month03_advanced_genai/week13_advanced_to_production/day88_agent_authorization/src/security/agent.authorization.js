export function hasAgentPermission(agent, permission) {
  return Array.isArray(agent?.permissions) &&
    agent.permissions.includes(permission);
}

export function canAgentActForUser({ user, agent, permission }) {
  return Boolean(
    user &&
    agent &&
    user.permissions?.includes(permission) &&
    agent.permissions?.includes(permission)
  );
}
