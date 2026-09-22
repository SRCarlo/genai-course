export function createTrace(requestId) {
  const spans = [];
  return {
    requestId,
    startSpan(name) {
      const startedAt = performance.now();
      return {
        end(metadata = {}) {
          const durationMs = Number((performance.now() - startedAt).toFixed(2));
          const span = { name, durationMs, ...metadata };
          spans.push(span);
          return span;
        },
      };
    },
    getTrace() {
      return {
        requestId,
        spans,
        totalDurationMs: Number(
          spans.reduce((sum, span) => sum + span.durationMs, 0).toFixed(2),
        ),
      };
    },
  };
}
