import crypto from "node:crypto";

export class SemanticCache {
  constructor(options = {}) {
    this.cache = new Map();

    this.similarityThreshold = options.similarityThreshold ?? 0.9;
    this.ttlMs = options.ttlMs ?? 60 * 60 * 1000;
  }

  createKey({ tenantId, userScope = "default", query }) {
    if (!tenantId) {
      throw new Error("tenantId is required");
    }

    if (!query) {
      throw new Error("query is required");
    }

    const normalizedQuery = query.trim().toLowerCase();

    return crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          tenantId,
          userScope,
          query: normalizedQuery,
        }),
      )
      .digest("hex");
  }

  set({ tenantId, userScope = "default", query, response, metadata = {} }) {
    const key = this.createKey({
      tenantId,
      userScope,
      query,
    });

    this.cache.set(key, {
      tenantId,
      userScope,
      query: query.trim().toLowerCase(),
      response,
      metadata,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.ttlMs,
    });

    return {
      key,
      cached: true,
    };
  }

  get({ tenantId, userScope = "default", query }) {
    const key = this.createKey({
      tenantId,
      userScope,
      query,
    });

    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Remove expired cache entries
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Extra tenant-scope protection
    if (entry.tenantId !== tenantId) {
      return null;
    }

    if (entry.userScope !== userScope) {
      return null;
    }

    return {
      response: entry.response,
      metadata: entry.metadata,
      tenantId: entry.tenantId,
      userScope: entry.userScope,
      query: entry.query,
      cached: true,
      key,
    };
  }

  has({ tenantId, userScope = "default", query }) {
    return Boolean(
      this.get({
        tenantId,
        userScope,
        query,
      }),
    );
  }

  delete({ tenantId, userScope = "default", query }) {
    const key = this.createKey({
      tenantId,
      userScope,
      query,
    });

    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      similarityThreshold: this.similarityThreshold,
      ttlMs: this.ttlMs,
    };
  }
}
