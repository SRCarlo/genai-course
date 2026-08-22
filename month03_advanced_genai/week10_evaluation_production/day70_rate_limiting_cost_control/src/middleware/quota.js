import { getPlan } from "../utils/plans.js";

export function quotaCheck(req, res, next) {
  const planName = req.user?.planName || "free";

  const plan = getPlan(planName);

  if (!plan) {
    return res.status(403).json({
      error: "invalid_plan",
      message: "Unable to determine user plan",
    });
  }

  // Make absolutely sure the plan is available
  // to downstream middleware/routes.
  req.plan = plan;

  if (req.user) {
    req.user.plan = plan;
  }

  const monthlyUsage =
    req.user?.monthlyTokens ?? 0;

  const requestedOutputTokens =
    Number(req.body?.maxOutputTokens) ||
    Number(req.body?.max_completion_tokens) ||
    0;

  if (
    requestedOutputTokens > plan.maxOutputTokens
  ) {
    return res.status(400).json({
      error: "max_output_tokens_exceeded",

      message:
        `Your ${plan.name} plan allows a maximum of ` +
        `${plan.maxOutputTokens} output tokens.`,

      requested: requestedOutputTokens,

      allowed: plan.maxOutputTokens,
    });
  }

  if (monthlyUsage >= plan.monthlyTokens) {
    return res.status(429).json({
      error: "quota_exceeded",

      message:
        "Your monthly token quota has been exceeded.",

      monthlyUsage,

      monthlyLimit: plan.monthlyTokens,
    });
  }

  next();
}