const clients = new Map();

export function rateLimit({ windowMs = 60000, maxRequests = 100 } = {}) {
  return function rateLimitMiddleware(req, res, next) {
    const key = req.user?.id || req.ip || "anonymous";

    const now = Date.now();

    let record = clients.get(key);

    if (!record || now > record.resetAt) {
      record = {
        count: 0,
        resetAt: now + windowMs,
      };
    }

    record.count += 1;

    clients.set(key, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests.",
        },
      });
    }

    next();
  };
}
