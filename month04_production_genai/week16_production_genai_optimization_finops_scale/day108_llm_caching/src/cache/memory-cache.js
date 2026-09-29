export class MemoryCache {
  constructor(maxEntries = 1000) {
    this.store = new Map();
    this.maxEntries = maxEntries;
  }

  get(key) {
    const entry = this.store.get(key);

    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    // LRU behavior: refresh recently used entry.
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.value;
  }

  set(key, value, ttlMs = 60_000) {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    while (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now()
    });
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }

  size() {
    return this.store.size;
  }

  keys() {
    return [...this.store.keys()];
  }
}