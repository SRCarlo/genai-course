import { validateToolCall } from "./validator.js";
import { checkToolGuard } from "../guardrails/tool.guard.js";
import { toolRegistry } from "./registry.js";

const DEFAULT_TIMEOUT = 5000;
const MAX_RETRIES = 2;

export async function executeTool(toolName, args, context = {}) {
  const tool = toolRegistry[toolName];

  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }

  validateToolCall(toolName, args);

  const guard = checkToolGuard(tool, context);

  if (!guard.allowed) {
    const error = new Error(`Tool "${toolName}" requires human approval`);

    error.code = "APPROVAL_REQUIRED";

    throw error;
  }

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await executeWithTimeout(
        tool.execute,
        args,
        DEFAULT_TIMEOUT,
      );

      return {
        success: true,
        result,
        attempts: attempt + 1,
      };
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt >= MAX_RETRIES) {
        break;
      }

      const delay = 100 * 2 ** attempt + Math.floor(Math.random() * 100);

      await sleep(delay);
    }
  }

  return {
    success: false,
    error: lastError?.message || "Tool execution failed",
    code: lastError?.code || "TOOL_ERROR",
  };
}

function executeWithTimeout(tool, args, timeoutMs) {
  return Promise.race([
    tool(args),

    new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error("Tool execution timed out");

        error.code = "TIMEOUT";

        reject(error);
      }, timeoutMs);
    }),
  ]);
}

function isRetryable(error) {
  return [
    "429",
    "502",
    "503",
    "504",
    "ECONNRESET",
    "ETIMEDOUT",
    "TIMEOUT",
  ].includes(error?.code);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
