export class Metrics {
  constructor() {
    this.data = {
      requests: 0,
      successes: 0,
      failures: 0,
      cacheHits: 0,
      fallbacks: 0,
      retries: 0,
      totalLatencyMs: 0,
    };
  }
  increment(name) {
    if (name in this.data) this.data[name] += 1;
  }
  addLatency(ms) {
    this.data.totalLatencyMs += ms;
  }
  snapshot() {
    return {
      ...this.data,
      averageLatencyMs: this.data.requests
        ? Math.round(this.data.totalLatencyMs / this.data.requests)
        : 0,
    };
  }
}
