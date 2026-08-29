import { toolRegistry } from "./tool.registry.js";
import { validateToolCall } from "./tool.validator.js";
import { authorizeTool } from "../guardrails/permission.guard.js";
import { checkToolRisk } from "../guardrails/risk.guard.js";

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Tool execution timed out"));
      }, timeoutMs);
    }),
  ]);
}

export async function executeTool({
  toolName,
  args,
  userRole = "customer",
  timeoutMs = 5000,
}) {
  const startTime = Date.now();

  const tool = toolRegistry[toolName];

  if (!tool) {
    return {
      success: false,
      error: "Unknown tool",
    };
  }

  const authorization = authorizeTool({
    tool,
    userRole,
  });

  if (!authorization.allowed) {
    return {
      success: false,
      error: authorization.reason,
    };
  }

  const risk = checkToolRisk(tool);

  if (!risk.allowed) {
    return {
      success: false,
      error: risk.reason,
      requiresApproval: risk.requiresApproval,
    };
  }

  const validation = validateToolCall(toolName, args);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
      details: validation.details,
    };
  }

  try {
    const result = await withTimeout(tool.execute(validation.data), timeoutMs);

    return {
      ...result,

      metadata: {
        tool: toolName,
        durationMs: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error(`Tool ${toolName} failed:`, error.message);

    return {
      success: false,
      error: "Tool execution failed",

      metadata: {
        tool: toolName,
        durationMs: Date.now() - startTime,
      },
    };
  }
}
