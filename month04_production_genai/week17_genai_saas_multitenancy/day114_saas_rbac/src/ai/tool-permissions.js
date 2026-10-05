import { PERMISSIONS } from "../permissions/permissions.js";

export const TOOL_PERMISSIONS = Object.freeze({
  search_documents: PERMISSIONS.SEARCH_DOCUMENTS,
  send_email: PERMISSIONS.SEND_EMAIL,
  create_invoice: PERMISSIONS.CREATE_INVOICE,
  delete_document: PERMISSIONS.MANAGE_DOCUMENTS,
  manage_users: PERMISSIONS.MANAGE_USERS,
});
