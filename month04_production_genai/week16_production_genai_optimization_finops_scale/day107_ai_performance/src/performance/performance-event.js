export function createPerformanceEvent({
  requestId,
  stage,
  durationMs,
  metadata = {},
}) {
  return {
    event: "AI_PERFORMANCE",
    requestId,
    stage,
    durationMs: Number(durationMs.toFixed(2)),
    timestamp: new Date().toISOString(),
    ...metadata,
  };
}
