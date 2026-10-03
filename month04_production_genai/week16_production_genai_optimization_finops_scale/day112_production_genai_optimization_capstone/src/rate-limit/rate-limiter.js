export class RateLimiter {
  constructor({ maxRequests = 20, windowMs = 60000 } = {}) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  allow(clientId) {
    const now = Date.now();
    const entry = this.requests.get(clientId);
    if (!entry || now >= entry.resetAt) {
      this.requests.set(clientId, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (entry.count >= this.maxRequests) return false;
    entry.count += 1;
    return true;
  }
}
