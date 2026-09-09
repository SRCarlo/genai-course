import { hasPermission } from "./authorization.js";
import { hasAgentPermission } from "./agent.authorization.js";

export function authorizeTool({ user, agent, tool }) {
  if (!tool) return false;
  if (!hasPermission(user.role, tool.permission)) return false;
  if (!hasAgentPermission(agent, tool.permission)) return false;
  return true;
}
