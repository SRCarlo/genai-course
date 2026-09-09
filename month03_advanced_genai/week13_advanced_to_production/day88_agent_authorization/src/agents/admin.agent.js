import { createAgentIdentity } from "../security/agent.identity.js";
import { permissions } from "../security/permissions.js";

export const adminAgent = createAgentIdentity({
  agentId: "admin-agent-01",
  agentType: "admin",
  permissions: [
    permissions.READ_CUSTOMERS,
    permissions.READ_ORDERS,
    permissions.REFUND_ORDERS,
    permissions.DELETE_CUSTOMER
  ]
});
