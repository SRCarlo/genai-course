export const users = new Map([
  [
    "user-demo",
    {
      id: "user-demo",
      tenantId: "tenant-acme",
      role: "owner"
    }
  ],
  [
    "user-other",
    {
      id: "user-other",
      tenantId: "tenant-other",
      role: "member"
    }
  ]
]);

export function getUser(userId) {
  return users.get(userId) ?? null;
}
