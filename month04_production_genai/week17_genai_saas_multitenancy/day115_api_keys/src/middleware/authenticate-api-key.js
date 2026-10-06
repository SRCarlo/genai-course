export function authenticateApiKey(apiKeyService) {
  return async (req, res, next) => {
    const header = req.get("authorization");

    if (!header) {
      return res.status(401).json({
        error: "Missing authorization"
      });
    }

    const [scheme, apiKey, ...extra] = header.trim().split(/\s+/);

    if (
      scheme !== "Bearer" ||
      !apiKey ||
      extra.length > 0
    ) {
      return res.status(401).json({
        error: "Invalid authorization"
      });
    }

    try {
      req.identity = await apiKeyService.authenticate(apiKey);
      next();
    } catch {
      return res.status(401).json({
        error: "Invalid API key"
      });
    }
  };
}
