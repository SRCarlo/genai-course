export function rateLimit({ limiter, getKey }) {
  return (req, res, next) => {
    const key = getKey(req);
    const result = limiter.allow(key);

    res.setHeader("X-RateLimit-Limit", String(result.limit));
    res.setHeader("X-RateLimit-Remaining", String(result.remaining));
    res.setHeader(
      "X-RateLimit-Reset",
      String(Math.ceil(result.resetAt / 1000))
    );

    if (!result.allowed) {
      const retryAfter = Math.max(
        1,
        Math.ceil((result.resetAt - Date.now()) / 1000)
      );

      res.setHeader("Retry-After", String(retryAfter));

      return res.status(429).json({
        error: "rate_limit_exceeded",
        message: "Too many requests.",
        retryAfter
      });
    }

    next();
  };
}
