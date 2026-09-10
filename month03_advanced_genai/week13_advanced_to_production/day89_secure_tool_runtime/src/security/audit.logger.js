export function auditToolExecution({
  requestId,
  userId,
  agentId,
  tool,
  authorized,
  risk,
  success,
  durationMs,
  errorCode = null
}) {
  const auditEvent = {
    timestamp: new Date().toISOString(),

    type: "TOOL_EXECUTION",

    requestId,

    userId,

    agentId,

    tool,

    authorized,

    risk,

    success,

    durationMs,

    errorCode
  };

  console.log(
    JSON.stringify(auditEvent)
  );

  return auditEvent;
}