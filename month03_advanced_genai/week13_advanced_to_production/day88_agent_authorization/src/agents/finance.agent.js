import { createAgentIdentity } from "../security/agent.identity.js";
import { permissions } from "../security/permissions.js";

export const financeAgent = createAgentIdentity({
  agentId: "finance-agent-01",
  agentType: "finance",
  permissions: [
    permissions.READ_ORDERS,
    permissions.REFUND_ORDERS
  ]
});
