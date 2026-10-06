export const tenants = new Map([
  ["tenant-acme", { id: "tenant-acme", name: "Acme Demo" }],
  ["tenant-other", { id: "tenant-other", name: "Other Demo" }]
]);

export function getTenant(tenantId) {
  return tenants.get(tenantId) ?? null;
}
