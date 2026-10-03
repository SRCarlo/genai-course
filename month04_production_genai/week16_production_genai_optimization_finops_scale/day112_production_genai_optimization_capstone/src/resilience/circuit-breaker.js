export class CircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeoutMs = 10000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.failures = 0;
    this.state = "CLOSED";
    this.openedAt = null;
  }
  canRequest() {
    if (this.state === "CLOSED") return true;
    if (
      this.state === "OPEN" &&
      Date.now() - this.openedAt >= this.resetTimeoutMs
    ) {
      this.state = "HALF_OPEN";
      return true;
    }
    return this.state === "HALF_OPEN";
  }
  success() {
    this.failures = 0;
    this.state = "CLOSED";
    this.openedAt = null;
  }
  failure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = "OPEN";
      this.openedAt = Date.now();
    }
  }
  snapshot() {
    return {
      state: this.state,
      failures: this.failures,
      openedAt: this.openedAt,
    };
  }
}
