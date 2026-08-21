export function requireTenant(req, res, next) {
  if (!req.user?.tenantId) {
    return res.status(403).json({
      error: "Tenant context missing",
    });
  }

  req.tenantId = req.user.tenantId;

  next();
}
