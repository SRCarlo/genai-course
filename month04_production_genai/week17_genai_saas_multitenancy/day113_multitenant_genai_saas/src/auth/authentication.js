export function createAuthenticationMiddleware(apiKeyService) {
  return (req, res, next) => {
    try {
      const authorization = req.get("authorization");

      if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Missing or invalid Authorization header"
        });
      }

      const apiKey = authorization.slice("Bearer ".length).trim();
      const identity = apiKeyService.authenticate(apiKey);

      req.identity = identity;
      next();
    } catch (error) {
      return res.status(401).json({
        error: error.message
      });
    }
  };
}