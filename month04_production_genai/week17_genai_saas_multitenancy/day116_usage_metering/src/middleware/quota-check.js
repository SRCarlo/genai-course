export function requireQuota({ quotaService, getEstimatedTokens }) {
  return (req, res, next) => {
    const estimatedTokens = getEstimatedTokens(req);

    const result = quotaService.checkProjected({
      tenantId: req.identity.tenantId,
      planName: req.identity.plan,
      estimatedTokens
    });

    if (!result.allowed) {
      return res.status(429).json({
        error: "quota_exceeded",
        message: "The request would exceed the current monthly quota.",
        estimatedTokens,
        requests: result.requests,
        tokens: result.tokens
      });
    }

    req.quota = result;
    next();
  };
}
