export class CacheMetrics {
  constructor() {
    this.reset();
  }

  recordHit(latencyMs = 0) {
    this.hits++;
    this.savedLlmCalls++;
    this.recordLatency(latencyMs);
  }

  recordMiss(latencyMs = 0) {
    this.misses++;
    this.recordLatency(latencyMs);
  }

  recordError() {
    this.cacheErrors++;
  }

  recordEviction() {
    this.evictions++;
  }

  recordLatency(latencyMs) {
    this.totalCacheLatencyMs += latencyMs;
    this.cacheOperations++;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total === 0 ? 0 : this.hits / total;
    const missRate = total === 0 ? 0 : this.misses / total;
    const averageCacheLatencyMs =
      this.cacheOperations === 0
        ? 0
        : this.totalCacheLatencyMs / this.cacheOperations;

    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate,
      missRate,
      hitRatePercentage: Number((hitRate * 100).toFixed(2)),
      missRatePercentage: Number((missRate * 100).toFixed(2)),
      cacheErrors: this.cacheErrors,
      evictions: this.evictions,
      savedLlmCalls: this.savedLlmCalls,
      averageCacheLatencyMs: Number(averageCacheLatencyMs.toFixed(2))
    };
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    this.cacheErrors = 0;
    this.evictions = 0;
    this.savedLlmCalls = 0;
    this.totalCacheLatencyMs = 0;
    this.cacheOperations = 0;
  }
}