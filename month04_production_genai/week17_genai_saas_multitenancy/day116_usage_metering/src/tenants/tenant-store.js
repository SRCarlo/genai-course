export class TenantStore {
  constructor({ defaultTenantId, defaultUserId, defaultApiKeyId, demoApiKey }) {
    this.apiKeys = new Map([
      [
        demoApiKey,
        {
          apiKeyId: defaultApiKeyId,
          tenantId: defaultTenantId,
          userId: defaultUserId,
          plan: "pro",
          active: true
        }
      ]
    ]);

    this.tenants = new Map([
      [
        defaultTenantId,
        {
          tenantId: defaultTenantId,
          name: "ACME Corp",
          plan: "pro"
        }
      ]
    ]);
  }

  resolveApiKey(apiKey) {
    const identity = this.apiKeys.get(apiKey);

    if (!identity || !identity.active) {
      return null;
    }

    return { ...identity };
  }

  getTenant(tenantId) {
    const tenant = this.tenants.get(tenantId);
    return tenant ? { ...tenant } : null;
  }
}
