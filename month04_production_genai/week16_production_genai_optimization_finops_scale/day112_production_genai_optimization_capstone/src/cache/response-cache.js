export class ResponseCache {
  constructor(ttlMs = 60000) {
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
  set(key, value) {
    this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}
