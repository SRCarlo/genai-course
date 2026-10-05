const tenants = new Map([
  ["tenant-acme", { id: "tenant-acme", name: "Acme Corp", status: "active" }],
  ["tenant-beta", { id: "tenant-beta", name: "Beta Labs", status: "active" }],
]);

const resources = new Map([
  [
    "conversation-001",
    {
      id: "conversation-001",
      type: "conversation",
      tenantId: "tenant-acme",
      userId: "user-003",
      content: "Acme member conversation",
    },
  ],
  [
    "conversation-002",
    {
      id: "conversation-002",
      type: "conversation",
      tenantId: "tenant-beta",
      userId: "user-005",
      content: "Beta member conversation",
    },
  ],
  [
    "document-001",
    {
      id: "document-001",
      type: "document",
      tenantId: "tenant-acme",
      userId: "user-003",
      content: "Acme document",
    },
  ],
  [
    "document-002",
    {
      id: "document-002",
      type: "document",
      tenantId: "tenant-beta",
      userId: "user-005",
      content: "Beta document",
    },
  ],
  [
    "apiKey-001",
    {
      id: "apiKey-001",
      type: "apiKey",
      tenantId: "tenant-acme",
      userId: "user-002",
      content: "Admin-owned key",
    },
  ],
]);

export class TenantRegistry {
  get(tenantId) {
    const tenant = tenants.get(tenantId);
    if (!tenant) throw new Error("Tenant not found");
    return structuredClone(tenant);
  }
}

export class TenantAccessService {
  constructor({ roleService }) {
    this.roleService = roleService;
  }

  canAccessResource(user, resource, { allowTenantAdmins = true } = {}) {
    if (!resource) return false;
    if (user.tenantId !== resource.tenantId) return false;
    if (allowTenantAdmins && ["owner", "admin"].includes(user.role))
      return true;
    return user.id === resource.userId;
  }

  getResource(resourceId) {
    const resource = resources.get(resourceId);
    if (!resource) throw new Error("Resource not found");
    return structuredClone(resource);
  }

  canAccess(user, resourceId) {
    return this.canAccessResource(user, this.getResource(resourceId));
  }
}
