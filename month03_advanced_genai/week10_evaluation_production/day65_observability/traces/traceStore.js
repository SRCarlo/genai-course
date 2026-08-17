const traces = new Map();

export function saveTrace(trace) {
  if (!trace || !trace.traceId) {
    throw new Error("Cannot save trace without traceId");
  }

  traces.set(trace.traceId, trace);

  console.log(`[TRACE STORE] Saved: ${trace.traceId}`);

  return trace;
}

export function getTrace(traceId) {
  console.log(`[TRACE STORE] Looking for: ${traceId}`);

  console.log(`[TRACE STORE] Available traces:`, Array.from(traces.keys()));

  return traces.get(traceId);
}

export function getAllTraces() {
  return Array.from(traces.values());
}

export function deleteTrace(traceId) {
  return traces.delete(traceId);
}

export function clearTraces() {
  traces.clear();
}
