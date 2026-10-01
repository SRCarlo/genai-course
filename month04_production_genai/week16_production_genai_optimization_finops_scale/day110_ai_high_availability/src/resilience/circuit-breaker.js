export class CircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeout = 5000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = "CLOSED";
    this.openedAt = null;
  }
  getState() {
    return this.state;
  }
  async execute(task) {
    if (this.state === "OPEN") {
      if (Date.now() - this.openedAt < this.resetTimeout)
        throw new Error("Circuit is open");
      this.state = "HALF_OPEN";
    }
    try {
      const result = await task();
      this.failures = 0;
      this.state = "CLOSED";
      this.openedAt = null;
      return result;
    } catch (error) {
      this.failures++;
      if (this.failures >= this.failureThreshold) {
        this.state = "OPEN";
        this.openedAt = Date.now();
      }
      throw error;
    }
  }
}
