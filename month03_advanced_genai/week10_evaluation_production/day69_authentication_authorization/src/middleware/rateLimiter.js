import { rateLimitStore } from "../data/store.js";
import { env } from "../config/env.js";

export function rateLimiter(req, res, next) {
  const identity = req.user?.id || req.ip || "anonymous";

  const now = Date.now();

  const current = rateLimitStore.get(identity);

  if (!current) {
    rateLimitStore.set(identity, {
      count: 1,
      resetAt: now + env.rateLimitWindowMs,
    });

    return next();
  }

  if (now > current.resetAt) {
    rateLimitStore.set(identity, {
      count: 1,
      resetAt: now + env.rateLimitWindowMs,
    });

    return next();
  }

  if (current.count >= env.rateLimitMaxRequests) {
    return res.status(429).json({
      error: "Rate limit exceeded",
    });
  }

  current.count += 1;

  next();
}
