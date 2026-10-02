export function isWithinLatencyBudget(latencyMs, maxLatencyMs) {
  if (maxLatencyMs == null) return true;
  return latencyMs <= maxLatencyMs;
}
