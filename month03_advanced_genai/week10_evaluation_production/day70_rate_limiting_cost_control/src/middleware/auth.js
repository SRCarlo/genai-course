import { getPlan } from "../utils/plans.js";

export function authenticate(req, res, next) {
  const userId = req.headers["x-user-id"];
  const tenantId = req.headers["x-tenant-id"];
  const planName = req.headers["x-plan"] || "free";

  if (!userId || !tenantId) {
    return res.status(401).json({
      error: "authentication_required",
      message: "x-user-id and x-tenant-id headers are required",
    });
  }

  const plan = getPlan(planName);

  req.user = {
    id: userId,
    tenantId,
    planName,
    plan,
    monthlyTokens: 0,
  };

  // Keep a direct reference as well.
  req.plan = plan;

  next();
}