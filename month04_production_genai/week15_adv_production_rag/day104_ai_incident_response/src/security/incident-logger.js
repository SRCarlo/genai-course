function sanitize(value) {
  if (value === undefined || value === null) return value;
  if (typeof value !== "object") return value;

  const sensitiveKeys = new Set([
    "apiKey",
    "authorization",
    "password",
    "secret",
    "token",
    "prompt",
    "fullDocument",
    "modelResponse",
  ]);

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !sensitiveKeys.has(key))
      .map(([key, val]) => [
        key,
        typeof val === "object" ? sanitize(val) : val,
      ]),
  );
}

export function logIncident({
  id,
  type,
  severity,
  message,
  requestId = null,
  metadata = {},
}) {
  const event = sanitize({
    event: "AI_SECURITY_INCIDENT",
    id,
    type,
    severity,
    message,
    requestId,
    metadata,
    timestamp: new Date().toISOString(),
  });

  console.error(JSON.stringify(event));
  return event;
}

export function createAuditEvent({
  event,
  userId = null,
  tenantId = null,
  resourceId = null,
  requestId = null,
  result,
  metadata = {},
}) {
  return sanitize({
    event,
    userId,
    tenantId,
    resourceId,
    requestId,
    result,
    metadata,
    timestamp: new Date().toISOString(),
  });
}
