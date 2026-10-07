export class FixedWindowRateLimiter {
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  allow(key) {
    const now = Date.now();
    const current = this.requests.get(key);

    if (!current || now - current.start >= this.windowMs) {
      this.requests.set(key, {
        start: now,
        count: 1
      });

      return {
        allowed: true,
        limit: this.limit,
        remaining: this.limit - 1,
        resetAt: now + this.windowMs
      };
    }

    if (current.count >= this.limit) {
      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        resetAt: current.start + this.windowMs
      };
    }

    current.count += 1;

    return {
      allowed: true,
      limit: this.limit,
      remaining: this.limit - current.count,
      resetAt: current.start + this.windowMs
    };
  }
}
