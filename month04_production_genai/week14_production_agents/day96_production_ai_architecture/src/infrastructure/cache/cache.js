const cache = new Map();

export const cacheService = {
  get(key) {
    const item = cache.get(key);

    if (!item) {
      return null;
    }

    if (item.expiresAt < Date.now()) {
      cache.delete(key);
      return null;
    }

    return item.value;
  },

  set(key, value, ttlMs = 60000) {
    cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  },

  delete(key) {
    cache.delete(key);
  },

  clear() {
    cache.clear();
  },
};
