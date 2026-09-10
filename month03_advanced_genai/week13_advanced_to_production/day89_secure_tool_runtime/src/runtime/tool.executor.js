import { retryTool } from "./tool.retry.js";
import { withTimeout } from "./tool.timeout.js";
import {
  validateToolArguments,
  validateToolResult
} from "./tool.validator.js";

export async function executeToolSafely({
  tool,
  args,
  timeoutMs = 10000,
  retryOptions = {}
}) {
  try {
    const validatedArgs =
      validateToolArguments(tool, args);

    const result = await retryTool(
      () =>
        withTimeout(
          tool.execute(validatedArgs),
          timeoutMs
        ),
      retryOptions
    );

    const validatedResult =
      validateToolResult(tool, result);

    return {
      success: true,
      tool: tool.name,
      data: validatedResult
    };
  } catch (error) {
    return {
      success: false,
      tool: tool.name,
      error: {
        code:
          error.code ||
          "TOOL_EXECUTION_FAILED",

        message: error.message
      }
    };
  }
}