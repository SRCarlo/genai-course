export class TenantRateLimiter {
  constructor() {
    this.requests = new Map();
  }

  allow(tenantId, maxRequests, windowMs = 60_000) {
    const now = Date.now();
    let entry = this.requests.get(tenantId);

    if (!entry || now >= entry.resetAt) {
      entry = {
        count: 0,
        resetAt: now + windowMs
      };
      this.requests.set(tenantId, entry);
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count += 1;
    return true;
  }

  getState(tenantId) {
    const entry = this.requests.get(tenantId);

    if (!entry) {
      return { count: 0, resetAt: null };
    }

    return { ...entry };
  }
}