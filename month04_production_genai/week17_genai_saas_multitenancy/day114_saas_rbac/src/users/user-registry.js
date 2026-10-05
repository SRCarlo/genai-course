const users = new Map([
  [
    "user-001",
    {
      id: "user-001",
      email: "owner@acme.com",
      tenantId: "tenant-acme",
      role: "owner",
      active: true,
    },
  ],
  [
    "user-002",
    {
      id: "user-002",
      email: "admin@acme.com",
      tenantId: "tenant-acme",
      role: "admin",
      active: true,
    },
  ],
  [
    "user-003",
    {
      id: "user-003",
      email: "member@acme.com",
      tenantId: "tenant-acme",
      role: "member",
      active: true,
    },
  ],
  [
    "user-004",
    {
      id: "user-004",
      email: "viewer@acme.com",
      tenantId: "tenant-acme",
      role: "viewer",
      active: true,
    },
  ],
  [
    "user-005",
    {
      id: "user-005",
      email: "member@beta.com",
      tenantId: "tenant-beta",
      role: "member",
      active: true,
    },
  ],
  [
    "user-006",
    {
      id: "user-006",
      email: "viewer@beta.com",
      tenantId: "tenant-beta",
      role: "viewer",
      active: true,
    },
  ],
  [
    "user-007",
    {
      id: "user-007",
      email: "inactive@acme.com",
      tenantId: "tenant-acme",
      role: "member",
      active: false,
    },
  ],
]);

export class UserRegistry {
  get(userId) {
    const user = users.get(userId);
    if (!user) throw new Error("User not found");
    return structuredClone(user);
  }

  listByTenant(tenantId) {
    return [...users.values()]
      .filter((user) => user.tenantId === tenantId)
      .map((user) => structuredClone(user));
  }

  create(user) {
    if (users.has(user.id)) throw new Error("User already exists");
    users.set(user.id, structuredClone(user));
    return structuredClone(user);
  }
}
