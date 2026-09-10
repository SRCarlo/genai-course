export function authorizeTool({
  tool,
  userPermissions = [],
  agentPermissions = []
}) {
  const requiredPermission = tool.permission;

  const userAllowed =
    userPermissions.includes(requiredPermission);

  const agentAllowed =
    agentPermissions.includes(requiredPermission);

  return userAllowed && agentAllowed;
}