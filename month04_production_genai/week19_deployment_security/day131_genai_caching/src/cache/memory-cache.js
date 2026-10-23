function createMemoryCache({ defaultTtlMs = 60_000, now = Date.now } = {}) {
  if (!Number.isFinite(defaultTtlMs) || defaultTtlMs <= 0) {
    throw new TypeError("defaultTtlMs must be a positive number");
  }

  const entries = new Map();
  let hits = 0;
  let misses = 0;

  function get(key) {
    const entry = entries.get(key);

    if (!entry) {
      misses += 1;
      return undefined;
    }

    if (entry.expiresAt <= now()) {
      entries.delete(key);
      misses += 1;
      return undefined;
    }

    hits += 1;
    return entry.value;
  }

  function set(key, value, ttlMs = defaultTtlMs) {
    if (typeof key !== "string" || key.length === 0) {
      throw new TypeError("key must be a non-empty string");
    }

    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
      throw new TypeError("ttlMs must be a positive number");
    }

    entries.set(key, {
      value,
      expiresAt: now() + ttlMs,
    });
  }

  function del(key) {
    return entries.delete(key);
  }

  function clear() {
    entries.clear();
    hits = 0;
    misses = 0;
  }

  function stats() {
    const total = hits + misses;

    return {
      entries: entries.size,
      hits,
      misses,
      hitRate: total === 0 ? 0 : hits / total,
    };
  }

  return { get, set, del, clear, stats };
}

module.exports = { createMemoryCache };
