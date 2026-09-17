export function auth(req, res, next) {
  const userId = req.headers["x-user-id"] || "user-123";

  const tenantId = req.headers["x-tenant-id"] || "tenant-123";

  const role = req.headers["x-user-role"] || "user";

  req.user = {
    id: userId,
    tenantId,
    role,
  };

  next();
}
