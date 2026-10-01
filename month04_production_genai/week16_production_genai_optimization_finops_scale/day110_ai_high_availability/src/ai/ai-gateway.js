export class AIGateway {
  constructor({ primary, fallback, timeoutMs = 30000, circuitBreaker = null }) {
    this.primary = primary;
    this.fallback = fallback;
    this.timeoutMs = timeoutMs;
    this.circuitBreaker = circuitBreaker;
  }
  async generate(input) {
    try {
      const task = async () => this.primary.generate(input);
      const result = this.circuitBreaker
        ? await this.circuitBreaker.execute(task)
        : await task();
      return { ...result, provider: "primary", fallback: false };
    } catch (error) {
      console.error("Primary provider failed:", error.message);
      const result = await this.fallback.generate(input);
      return { ...result, provider: "fallback", fallback: true };
    }
  }
}
