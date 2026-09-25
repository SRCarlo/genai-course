export class CircuitBreaker {
  constructor({
    failureThreshold = 3,
    resetTimeout = 10_000,
    now = () => Date.now(),
  } = {}) {
    if (failureThreshold < 1) {
      throw new Error("failureThreshold must be >= 1");
    }

    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.now = now;
    this.failures = 0;
    this.state = "CLOSED";
    this.openedAt = null;
  }

  canRequest() {
    if (this.state === "CLOSED") {
      return true;
    }

    if (
      this.state === "OPEN" &&
      this.now() - this.openedAt >= this.resetTimeout
    ) {
      this.state = "HALF_OPEN";
      return true;
    }

    return false;
  }

  recordSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
    this.openedAt = null;
  }

  recordFailure() {
    this.failures += 1;

    if (this.failures >= this.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = this.now();
    }
  }

  async execute(action, fallback = null) {
    if (!this.canRequest()) {
      if (fallback) return fallback();
      throw new Error("Circuit is OPEN");
    }

    try {
      const result = await action();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();

      if (fallback) {
        return fallback(error);
      }

      throw error;
    }
  }
}
