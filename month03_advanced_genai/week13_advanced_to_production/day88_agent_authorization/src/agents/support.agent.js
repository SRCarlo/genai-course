import { createAgentIdentity } from "../security/agent.identity.js";
import { permissions } from "../security/permissions.js";

export const supportAgent = createAgentIdentity({
  agentId: "support-agent-01",
  agentType: "support",
  permissions: [
    permissions.READ_CUSTOMERS,
    permissions.READ_ORDERS,
    permissions.SEARCH_CUSTOMERS,
    permissions.SEND_EMAIL
  ]
});
