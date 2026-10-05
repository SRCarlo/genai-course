export class AuditLogger {
  constructor() {
    this.events = [];
  }

  log({
    userId = null,
    tenantId = null,
    action,
    resource = null,
    result,
    metadata = {},
  }) {
    this.events.push({
      userId,
      tenantId,
      action,
      resource,
      result,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  listForTenant(tenantId) {
    return this.events.filter((event) => event.tenantId === tenantId);
  }
}
