export function authenticate({ tenantStore }) {
  return (req, res, next) => {
    const apiKey = req.get("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        error: "authentication_required",
        message: "x-api-key header is required."
      });
    }

    const identity = tenantStore.resolveApiKey(apiKey);

    if (!identity) {
      return res.status(401).json({
        error: "invalid_api_key",
        message: "The API key is invalid or inactive."
      });
    }

    req.identity = identity;
    next();
  };
}
