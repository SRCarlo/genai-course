export function requireScope(scope) {
  return (req, res, next) => {
    if (req.authType !== "api-key") {
      return next();
    }

    const scopes = req.apiKey?.scopes || [];

    if (!scopes.includes(scope)) {
      return res.status(403).json({
        error: "API key scope does not permit this operation",
      });
    }

    next();
  };
}
