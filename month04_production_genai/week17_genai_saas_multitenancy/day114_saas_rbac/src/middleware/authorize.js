export function authorize(permissionService, permission, auditLogger) {
  return (req, res, next) => {
    const allowed = permissionService.check(req.user, permission);
    if (!allowed) {
      auditLogger?.log({
        userId: req.user.id,
        tenantId: req.user.tenantId,
        action: "authorization.failure",
        resource: req.path,
        result: "denied",
        metadata: { requiredPermission: permission },
      });
      return res
        .status(403)
        .json({ error: "Forbidden", requiredPermission: permission });
    }
    next();
  };
}
