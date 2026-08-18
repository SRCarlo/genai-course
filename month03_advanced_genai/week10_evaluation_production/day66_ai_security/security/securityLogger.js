export function createRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createTraceId() {
  return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function logSecurityEvent(event, data = {}, level = "info") {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  };

  console.log(JSON.stringify(entry));

  return entry;
}

export function securityLog(level, event, data = {}) {
  return logSecurityEvent(event, data, level);
}

export function log(level, event, data = {}) {
  return logSecurityEvent(event, data, level);
}
