import { getTool } from "../tools/tool.registry.js";
import { authorizeTool } from "../security/authorization.js";
import { getRiskPolicy } from "../security/risk.policy.js";
import { requireHumanApproval } from "../security/approval.js";
import { executeToolSafely } from "./tool.executor.js";
import { auditToolExecution } from "../security/audit.logger.js";

export async function executeTool({
  toolName,
  arguments: args,
  authContext,
  approval = false,
}) {
  const startedAt = Date.now();

  const tool = getTool(toolName);

  /*
  |--------------------------------------------------------------------------
  | Tool Not Found
  |--------------------------------------------------------------------------
  */

  if (!tool) {
    auditToolExecution({
      requestId: authContext.request.id,
      userId: authContext.user.id,
      agentId: authContext.agent.id,
      tool: toolName,
      authorized: false,
      risk: "UNKNOWN",
      success: false,
      durationMs: Date.now() - startedAt,
      errorCode: "TOOL_NOT_FOUND",
    });

    return {
      success: false,
      error: {
        code: "TOOL_NOT_FOUND",
        message: `Tool '${toolName}' was not found.`,
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Authorization
  |--------------------------------------------------------------------------
  */

  const authorized = authorizeTool({
    tool,
    userPermissions: authContext.user.permissions,
    agentPermissions: authContext.agent.permissions,
  });

  if (!authorized) {
    auditToolExecution({
      requestId: authContext.request.id,
      userId: authContext.user.id,
      agentId: authContext.agent.id,
      tool: toolName,
      authorized: false,
      risk: tool.risk,
      success: false,
      durationMs: Date.now() - startedAt,
      errorCode: "TOOL_NOT_AUTHORIZED",
    });

    return {
      success: false,
      error: {
        code: "TOOL_NOT_AUTHORIZED",
        message: "The agent is not authorized to use this tool.",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Risk Policy
  |--------------------------------------------------------------------------
  */

  const risk = getRiskPolicy(tool.risk);

  if (!risk) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_TOOL_RISK",
        message: "Unknown tool risk level.",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Human Approval
  |--------------------------------------------------------------------------
  */

  if (risk.approvalRequired) {
    const approvalResult = await requireHumanApproval({
      toolName,
      arguments: args,
      approval,
    });

    /*
     * Approval not granted.
     *
     * This is NOT treated as an application error.
     * It is a normal security decision.
     */

    if (!approvalResult.approved) {
      auditToolExecution({
        requestId: authContext.request.id,
        userId: authContext.user.id,
        agentId: authContext.agent.id,
        tool: toolName,
        authorized: true,
        risk: tool.risk,
        success: false,
        durationMs: Date.now() - startedAt,
        errorCode: "HUMAN_APPROVAL_REQUIRED",
      });

      return {
        success: false,
        requiresApproval: true,
        error: {
          code: "HUMAN_APPROVAL_REQUIRED",
          message:
            "Human approval is required before this action can be executed.",
        },
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Safe Tool Execution
  |--------------------------------------------------------------------------
  */

  const result = await executeToolSafely({
    tool,
    args,
    timeoutMs: 10000,
    retryOptions: {
      maxAttempts: 3,

      shouldRetry: (error) => {
        const retryableCodes = [
          "TOOL_TIMEOUT",
          "ETIMEDOUT",
          "ECONNRESET",
          "ECONNREFUSED",
        ];

        return retryableCodes.includes(error.code);
      },
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Audit
  |--------------------------------------------------------------------------
  */

  auditToolExecution({
    requestId: authContext.request.id,
    userId: authContext.user.id,
    agentId: authContext.agent.id,
    tool: toolName,
    authorized: true,
    risk: tool.risk,
    success: result.success,
    durationMs: Date.now() - startedAt,
    errorCode: result.success ? null : result.error.code,
  });

  return result;
}
