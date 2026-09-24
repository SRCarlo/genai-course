const documents = [
  { id: "A-1", tenantId: "tenant-a", visibility: "private", text: "Tenant A private document" },
  { id: "A-2", tenantId: "tenant-a", visibility: "public", text: "Tenant A public document" },
  { id: "B-1", tenantId: "tenant-b", visibility: "private", text: "Tenant B private document" }
];

export function getDocumentForUser(user, documentId) {
  const document = documents.find(item => item.id === documentId);

  if (!document) {
    return { allowed: false, reason: "NOT_FOUND" };
  }

  if (document.tenantId !== user.tenantId) {
    return { allowed: false, reason: "TENANT_ACCESS_DENIED" };
  }

  return { allowed: true, document };
}

export { documents };
