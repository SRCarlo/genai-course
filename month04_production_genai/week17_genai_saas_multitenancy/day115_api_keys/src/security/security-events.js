export function createSecurityEvent({
  event,
  tenantId,
  userId,
  keyId,
  metadata = {}
}) {
  return {
    event,
    tenantId,
    userId,
    keyId,
    metadata,
    timestamp: new Date().toISOString()
  };
}

export function audit(event) {
  // Intentionally never receives or prints plaintext credentials.
  console.info("[security-event]", JSON.stringify(event));
}
