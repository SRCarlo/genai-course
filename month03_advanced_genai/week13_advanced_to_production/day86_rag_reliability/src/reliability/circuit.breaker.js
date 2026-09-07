import { AppError } from "./errors.js";

export class CircuitBreaker {
  constructor({
    failureThreshold = Number(process.env.CIRCUIT_FAILURE_THRESHOLD || 5),

    resetTimeout = Number(process.env.CIRCUIT_RESET_TIMEOUT_MS || 30000),
  } = {}) {
    this.failureThreshold = failureThreshold;

    this.resetTimeout = resetTimeout;

    this.state = "CLOSED";

    this.failureCount = 0;

    this.lastFailureTime = null;
  }

  async execute(action) {
    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.lastFailureTime;

      if (elapsed >= this.resetTimeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new AppError(
          "CIRCUIT_OPEN",
          "AI service is temporarily unavailable.",
          503,
        );
      }
    }

    try {
      const result = await action();

      this.onSuccess();

      return result;
    } catch (error) {
      this.onFailure();

      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    this.state = "CLOSED";
  }

  onFailure() {
    this.failureCount++;

    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  getState() {
    return {
      state: this.state,

      failureCount: this.failureCount,
    };
  }
}
