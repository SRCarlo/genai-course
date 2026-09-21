export function createTrace(requestId) {
  const start = Date.now();
  const spans = [];
  let active = null;

  return {
    requestId,
    spans,

    startSpan(name) {
      const span = {
        name,
        start: Date.now(),
      };
      active = span;
      return {
        end(metadata = {}) {
          span.durationMs = Date.now() - span.start;
          Object.assign(span, metadata);
          spans.push(span);
          if (active === span) active = null;
          return span;
        },
      };
    },

    finish() {
      return {
        requestId,
        spans,
        totalDurationMs: Date.now() - start,
      };
    },
  };
}
