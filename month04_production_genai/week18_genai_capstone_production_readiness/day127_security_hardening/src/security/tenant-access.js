export function requireTenantAccess({ authenticatedUser, requestedTenantId }) {
  if (!authenticatedUser?.id) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }
  const authorizedTenants = authenticatedUser.tenantIds;
  if (!Array.isArray(authorizedTenants) || !requestedTenantId || !authorizedTenants.includes(requestedTenantId)) {
    const error = new Error("Tenant access denied");
    error.statusCode = 403;
    throw error;
  }
  return requestedTenantId;
}
