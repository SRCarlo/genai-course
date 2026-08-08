const cache = new Map();

const TTL = Number(process.env.CACHE_TTL_MS) || 300000;

export function getCached(key) {
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  if (Date.now() - item.createdAt > TTL) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

export function setCached(key, value) {
  cache.set(key, {
    value,
    createdAt: Date.now(),
  });
}

export function clearCache() {
  cache.clear();
}
