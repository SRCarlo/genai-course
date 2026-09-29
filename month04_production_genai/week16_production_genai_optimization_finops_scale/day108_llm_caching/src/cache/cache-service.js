import { MemoryCache } from "./memory-cache.js";

export class CacheService {
  constructor({ maxEntries = 1000 } = {}) {
    this.cache = new MemoryCache(maxEntries);
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttlMs = 300_000) {
    this.cache.set(key, value, ttlMs);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    return this.cache.has(key);
  }

  size() {
    return this.cache.size();
  }

  keys() {
    return this.cache.keys();
  }
}