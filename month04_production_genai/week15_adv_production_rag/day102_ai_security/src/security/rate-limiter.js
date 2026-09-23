const requests = new Map();

export function checkRateLimit(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now - entry.startedAt > windowMs) {
    requests.set(key, {
      startedAt: now,
      count: 1,
    });

    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function resetRateLimits() {
  requests.clear();
}
