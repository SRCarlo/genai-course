import { verifyAccessToken } from "../services/token.service.js";

import { apiKeys } from "../data/store.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const [scheme, token] = header.trim().split(/\s+/);

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Invalid authorization header",
    });
  }

  /*
   * First try JWT.
   */
  try {
    const payload = verifyAccessToken(token);

    if (payload.type === "access") {
      req.user = {
        id: payload.sub,
        role: payload.role,
        tenantId: payload.tenantId,
        plan: payload.plan,
      };

      req.authType = "jwt";

      return next();
    }
  } catch {
    /*
     * Continue and check API key.
     */
  }

  /*
   * Demo API-key authentication.
   *
   * Production:
   * store only a hash of the API key.
   */
  const apiKey = apiKeys.find((key) => key.key === token);

  if (!apiKey) {
    return res.status(401).json({
      error: "Invalid or expired credentials",
    });
  }

  req.user = {
    id: apiKey.userId,
    role: "user",
    tenantId: apiKey.tenantId,
    plan: "free",
  };

  req.apiKey = apiKey;
  req.authType = "api-key";

  next();
}
