import { roles } from "./roles.js";

export function getUserPermissions(role) {
  return roles[role] ?? [];
}

export function hasPermission(role, permission) {
  return getUserPermissions(role).includes(permission);
}

export function hasEffectivePermission({
  userPermissions = [],
  agentPermissions = [],
  requiredPermission
}) {
  return (
    userPermissions.includes(requiredPermission) &&
    agentPermissions.includes(requiredPermission)
  );
}
