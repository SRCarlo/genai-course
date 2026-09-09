const auditEvents = [];

export function auditLog(event) {
  const record = {
    timestamp: new Date().toISOString(),
    ...event
  };
  auditEvents.push(record);
  console.log("[AUDIT]", JSON.stringify(record));
  return record;
}

export function getAuditLogs() {
  return [...auditEvents];
}

export function clearAuditLogs() {
  auditEvents.length = 0;
}
