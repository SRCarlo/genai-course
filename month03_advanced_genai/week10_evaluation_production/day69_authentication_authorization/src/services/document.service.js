import { documents } from "../data/store.js";
import { forbidden, notFound } from "../utils/errors.js";

export function getDocumentForUser({ documentId, userId, tenantId, role }) {
  const document = documents.find((item) => item.id === documentId);

  if (!document) {
    throw notFound("Document not found");
  }

  /*
   * Tenant isolation comes FIRST.
   */
  if (document.tenantId !== tenantId) {
    throw forbidden("Forbidden");
  }

  /*
   * Admin can access documents
   * within their own tenant.
   */
  if (role === "admin") {
    return document;
  }

  /*
   * Normal users can only access
   * documents they own.
   */
  if (document.ownerId !== userId) {
    throw forbidden("Forbidden");
  }

  return document;
}

export function getTenantDocuments(tenantId) {
  return documents.filter((document) => document.tenantId === tenantId);
}
