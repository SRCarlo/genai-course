const tenants = new Map([
  [
    "tenant-acme",
    {
      id: "tenant-acme",
      name: "Acme Corp",
      plan: "pro",
      status: "active"
    }
  ],
  [
    "tenant-beta",
    {
      id: "tenant-beta",
      name: "Beta Labs",
      plan: "free",
      status: "active"
    }
  ],
  [
    "tenant-enterprise",
    {
      id: "tenant-enterprise",
      name: "Enterprise Inc",
      plan: "enterprise",
      status: "active"
    }
  ]
]);

export class TenantRegistry {
  get(tenantId) {
    const tenant = tenants.get(tenantId);

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    return { ...tenant };
  }

  list() {
    return [...tenants.values()].map((tenant) => ({ ...tenant }));
  }

  create({ id, name, plan = "free", status = "active" }) {
    if (tenants.has(id)) {
      throw new Error("Tenant already exists");
    }

    const tenant = { id, name, plan, status };
    tenants.set(id, tenant);
    return { ...tenant };
  }

  update(tenantId, patch) {
    const current = this.get(tenantId);
    const updated = { ...current, ...patch, id: current.id };
    tenants.set(tenantId, updated);
    return { ...updated };
  }
}