export class TenantResolver {
  constructor(tenantRegistry) {
    this.tenantRegistry = tenantRegistry;
  }

  resolve(tenantId) {
    const tenant = this.tenantRegistry.get(tenantId);

    if (tenant.status !== "active") {
      throw new Error("Tenant is not active");
    }

    return tenant;
  }
}