function createRateLimiter({
  limit = 10,
  windowMs = 60_000,
  now = () => Date.now(),
} = {}) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("limit must be a positive integer");
  }

  if (!Number.isFinite(windowMs) || windowMs <= 0) {
    throw new Error("windowMs must be positive");
  }

  const clients = new Map();

  return function allowRequest(clientId) {
    const currentTime = now();
    const windowStart = Math.floor(currentTime / windowMs) * windowMs;

    const existing = clients.get(clientId);

    if (!existing || existing.windowStart !== windowStart) {
      clients.set(clientId, {
        windowStart,
        count: 1,
      });
      return true;
    }

    if (existing.count >= limit) {
      return false;
    }

    existing.count += 1;
    return true;
  };
}

module.exports = { createRateLimiter };
