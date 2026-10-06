export function requireTenantResource() {
  return (req, res, next) => {
    const requestedTenantId =
      req.body?.tenantId ??
      req.params?.tenantId ??
      req.query?.tenantId ??
      req.identity?.tenantId;

    if (requestedTenantId !== req.identity?.tenantId) {
      return res.status(403).json({
        error: "Tenant boundary violation"
      });
    }

    next();
  };
}
