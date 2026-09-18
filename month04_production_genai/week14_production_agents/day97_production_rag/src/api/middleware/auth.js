export function auth(req, res, next) {
  const tenantId = req.headers["x-tenant-id"];

  const userId = req.headers["x-user-id"];

  if (!tenantId || !userId) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing authentication headers",
      },
    });
  }

  req.user = {
    id: userId,
    tenantId,
  };

  next();
}
