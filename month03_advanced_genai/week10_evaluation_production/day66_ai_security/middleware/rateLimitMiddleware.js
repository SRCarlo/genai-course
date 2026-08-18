import dotenv from "dotenv";

import { logSecurityEvent } from "../security/securityLogger.js";

dotenv.config();

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);

const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 10);

const clients = new Map();

function getClientKey(req) {
  /*
   * In production, prefer an authenticated
   * user/API-key identity rather than blindly trusting
   * arbitrary forwarding headers.
   */
  return req.user?.id || req.ip || "anonymous";
}

function cleanupExpiredEntries(now) {
  for (const [key, entry] of clients.entries()) {
    if (now - entry.windowStart >= WINDOW_MS) {
      clients.delete(key);
    }
  }
}

export function rateLimitMiddleware(req, res, next) {
  const now = Date.now();

  cleanupExpiredEntries(now);

  const key = getClientKey(req);

  let entry = clients.get(key);

  if (!entry) {
    entry = {
      count: 0,
      windowStart: now,
    };

    clients.set(key, entry);
  }

  if (now - entry.windowStart >= WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);

  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, MAX_REQUESTS - entry.count),
  );

  if (entry.count > MAX_REQUESTS) {
    logSecurityEvent("security.rate_limit_exceeded", {
      ip: req.ip,
      path: req.path,
    });

    return res.status(429).json({
      error: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  next();
}

export function resetRateLimiter() {
  clients.clear();
}
