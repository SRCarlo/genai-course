export function validateRetrievedContext(documents, user) {
  if (!user?.id || !user?.tenantId) {
    throw new Error("Missing user security context");
  }

  if (!Array.isArray(documents)) {
    throw new Error("Retrieved context must be an array");
  }

  for (const document of documents) {
    if (document.tenantId !== user.tenantId) {
      throw new Error("Cross-tenant context detected");
    }

    if (!document.documentId || !document.content) {
      throw new Error("Invalid retrieved document");
    }
  }

  return true;
}
