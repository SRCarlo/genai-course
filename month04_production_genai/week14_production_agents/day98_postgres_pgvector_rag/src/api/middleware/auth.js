import { randomUUID } from "node:crypto";

export function auth(req, res, next) {
  const tenantId = req.header("x-tenant-id");
  const userId = req.header("x-user-id") ?? "practice-user";

  if (!tenantId) {
    return res.status(401).json({
      error: "Missing x-tenant-id header"
    });
  }

  req.auth = {
    tenantId,
    userId,
    requestId: randomUUID()
  };

  next();
}
