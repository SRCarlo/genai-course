export function tenantContext(tenantRegistry) {
  return (req, res, next) => {
    try {
      const tenant = tenantRegistry.get(req.user.tenantId);
      if (tenant.status !== "active") {
        return res.status(403).json({ error: "Tenant is inactive" });
      }
      req.tenant = tenant;
      next();
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  };
}
