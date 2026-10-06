export function requireScope(requiredScope) {
  return (req, res, next) => {
    const scopes = req.identity?.scopes ?? [];

    if (!scopes.includes(requiredScope)) {
      return res.status(403).json({
        error: "Insufficient scope",
        requiredScope
      });
    }

    next();
  };
}
