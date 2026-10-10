export function requireEntitlement(entitlementService, feature) {
  return async (req, res, next) => {
    try {
      const tenantId = req.auth?.tenantId;
      if (!tenantId) {
        return res.status(401).json({ error: "AUTHENTICATION_REQUIRED" });
      }

      await entitlementService.requireFeature(tenantId, feature);
      return next();
    } catch (error) {
      if ([
        "SUBSCRIPTION_NOT_FOUND",
        "SUBSCRIPTION_ACCESS_DENIED",
        "FEATURE_NOT_ENTITLED",
        "UNKNOWN_FEATURE"
      ].includes(error.message)) {
        const status = error.message === "SUBSCRIPTION_NOT_FOUND" ? 403 : 403;
        return res.status(status).json({ error: error.message });
      }
      return next(error);
    }
  };
}
