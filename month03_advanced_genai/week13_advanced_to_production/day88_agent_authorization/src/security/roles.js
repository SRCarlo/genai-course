import { permissions } from "./permissions.js";

export const roles = Object.freeze({
  customer: [permissions.READ_CUSTOMERS, permissions.READ_ORDERS],
  support: [
    permissions.SEARCH_CUSTOMERS,
    permissions.READ_CUSTOMERS,
    permissions.READ_ORDERS,
    permissions.SEND_EMAIL
  ],
  manager: [
    permissions.SEARCH_CUSTOMERS,
    permissions.READ_CUSTOMERS,
    permissions.READ_ORDERS,
    permissions.REFUND_ORDERS,
    permissions.SEND_EMAIL
  ],
  admin: Object.values(permissions)
});
