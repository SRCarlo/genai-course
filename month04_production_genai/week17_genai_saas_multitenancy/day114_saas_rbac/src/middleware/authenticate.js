export function authenticate(authenticationService, auditLogger) {
  return (req, res, next) => {
    try {
      const header = req.get("authorization");
      if (!header) {
        auditLogger?.log({
          tenantId: null,
          userId: null,
          action: "authentication",
          resource: req.path,
          result: "failure",
        });
        return res.status(401).json({ error: "Missing authorization" });
      }

      const [scheme, token, ...extra] = header.trim().split(/\s+/);
      if (scheme !== "Bearer" || !token || extra.length > 0) {
        auditLogger?.log({
          tenantId: null,
          userId: null,
          action: "authentication",
          resource: req.path,
          result: "failure",
        });
        return res.status(401).json({ error: "Invalid authorization" });
      }

      const user = authenticationService.authenticate(token);
      req.user = user;
      next();
    } catch (error) {
      auditLogger?.log({
        tenantId: null,
        userId: null,
        action: "authentication",
        resource: req.path,
        result: "failure",
      });
      return res.status(401).json({ error: error.message });
    }
  };
}
