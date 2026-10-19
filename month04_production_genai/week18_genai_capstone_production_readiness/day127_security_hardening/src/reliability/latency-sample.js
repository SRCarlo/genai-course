export function createLatencyCollector({ maxSamples = 10000 } = {}) {
  if (!Number.isInteger(maxSamples) || maxSamples < 1) {
    throw new RangeError("maxSamples must be a positive integer");
  }
  const samples = [];
  return {
    record(durationMs) {
      if (!Number.isFinite(durationMs) || durationMs < 0) {
        throw new RangeError("durationMs must be non-negative");
      }
      samples.push(durationMs);
      if (samples.length > maxSamples) samples.shift();
    },
    snapshot() { return [...samples]; },
    clear() { samples.length = 0; },
  };
}
