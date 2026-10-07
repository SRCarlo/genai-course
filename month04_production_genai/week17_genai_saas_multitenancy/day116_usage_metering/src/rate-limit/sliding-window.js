export class SlidingWindowRateLimiter {
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  allow(key) {
    const now = Date.now();
    const timestamps = this.requests.get(key) ?? [];

    const valid = timestamps.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (valid.length >= this.limit) {
      this.requests.set(key, valid);

      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        resetAt: valid[0] + this.windowMs
      };
    }

    valid.push(now);
    this.requests.set(key, valid);

    return {
      allowed: true,
      limit: this.limit,
      remaining: this.limit - valid.length,
      resetAt: valid[0] + this.windowMs
    };
  }
}
