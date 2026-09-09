import { auditLog } from "./audit.logger.js";
import { authorizeTool } from "./tool.authorization.js";
import { getRiskLevel, requiresHumanApproval } from "./risk.policy.js";

export async function executeTool({
  tool,
  arguments: args,
  authContext,
  requireApproval = false
}) {
  const { user, agent, request } = authContext;

  if (!tool) {
    auditLog({
      event: "tool_authorization_denied",
      requestId: request.id,
      userId: user.id,
      agentId: agent.agentId,
      reason: "TOOL_NOT_FOUND"
    });
    throw new Error("TOOL_NOT_FOUND");
  }

  if (!authorizeTool({ user, agent, tool })) {
    auditLog({
      event: "tool_authorization_denied",
      requestId: request.id,
      userId: user.id,
      agentId: agent.agentId,
      tool: tool.name,
      reason: "INSUFFICIENT_PERMISSION"
    });
    throw new Error("TOOL_NOT_AUTHORIZED");
  }

  let validatedArgs;
  try {
    validatedArgs = tool.schema.parse(args);
  } catch (error) {
    auditLog({
      event: "tool_validation_failed",
      requestId: request.id,
      userId: user.id,
      agentId: agent.agentId,
      tool: tool.name,
      reason: "INVALID_ARGUMENTS"
    });
    throw new Error("INVALID_TOOL_ARGUMENTS");
  }

  const risk = getRiskLevel(tool.name);

  if (requiresHumanApproval(risk) && !requireApproval) {
    auditLog({
      event: "tool_approval_required",
      requestId: request.id,
      userId: user.id,
      agentId: agent.agentId,
      tool: tool.name,
      risk,
      result: "PENDING_APPROVAL"
    });

    return {
      status: "APPROVAL_REQUIRED",
      requestId: request.id,
      tool: tool.name,
      risk
    };
  }

  const result = await tool.execute(validatedArgs, authContext);

  auditLog({
    event: "tool_execution",
    requestId: request.id,
    userId: user.id,
    agentId: agent.agentId,
    tool: tool.name,
    permission: tool.permission,
    risk,
    result: "allowed"
  });

  return result;
}
