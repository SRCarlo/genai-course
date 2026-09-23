export function canAccessDocument({ user, document }) {
  // Fail closed when identity or document data is missing.
  if (!user || !document) {
    return false;
  }

  if (!user.id || !user.tenantId) {
    return false;
  }

  if (!document.documentId || !document.tenantId) {
    return false;
  }

  // Tenant isolation must happen before retrieval.
  if (user.tenantId !== document.tenantId) {
    return false;
  }

  if (document.visibility === "public") {
    return true;
  }

  if (document.visibility === "private") {
    return document.ownerId === user.id;
  }

  // Unknown visibility => fail closed.
  return false;
}
