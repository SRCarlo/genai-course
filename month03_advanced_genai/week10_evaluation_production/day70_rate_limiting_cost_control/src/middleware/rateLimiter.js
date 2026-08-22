/*
 * Day 70 - Rate Limiting
 *
 * Learning implementation using in-memory storage.
 *
 * Production:
 * Use Redis/shared storage when running multiple
 * Node.js instances.
 */

const requests = new Map();

const WINDOW_MS = 60 * 1000;


/*
 * Rate limits by plan.
 */
const LIMITS = {
  free: 10,
  pro: 60,
  enterprise: 300,
};


/*
 * Get the identifier used for rate limiting.
 *
 * Authenticated API:
 * user ID
 *
 * Fallback:
 * IP address
 */
function getClientKey(req) {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }

  return `ip:${req.ip}`;
}


/*
 * Rate limiter middleware.
 */
export function rateLimiter(req, res, next) {
  const key = getClientKey(req);

  const planName =
    req.user?.planName || "free";

  const maxRequests =
    LIMITS[planName] ?? LIMITS.free;

  const now = Date.now();

  let record = requests.get(key);


  /*
   * Create a new window.
   */
  if (
    !record ||
    now - record.start >= WINDOW_MS
  ) {
    record = {
      start: now,
      count: 0,
    };
  }


  /*
   * Increment request count.
   */
  record.count += 1;

  requests.set(key, record);


  /*
   * Calculate remaining requests.
   */
  const remaining = Math.max(
    maxRequests - record.count,
    0
  );


  /*
   * Send rate-limit information
   * in response headers.
   */
  res.setHeader(
    "X-RateLimit-Limit",
    maxRequests
  );

  res.setHeader(
    "X-RateLimit-Remaining",
    remaining
  );


  /*
   * Rate limit exceeded.
   */
  if (record.count > maxRequests) {
    const elapsed =
      now - record.start;

    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - elapsed) / 1000
    );

    res.setHeader(
      "Retry-After",
      retryAfterSeconds
    );

    return res.status(429).json({
      error: "rate_limit_exceeded",

      message:
        "Too many requests. Please try again later.",

      limit: maxRequests,

      window: "1 minute",

      retryAfterSeconds,
    });
  }


  next();
}


/*
 * Useful for automated tests.
 */
export function resetRateLimits() {
  requests.clear();
}


/*
 * Useful for tests/debugging.
 */
export function getRateLimitRecord(key) {
  return requests.get(key);
}