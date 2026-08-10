import { getTool } from "../tools/toolRegistry.js";

import { validateToolArguments } from "../validators/toolValidator.js";

export async function executeToolCall(toolName, argumentsObject) {
  const tool = getTool(toolName);

  if (!tool) {
    return {
      success: false,
      tool: toolName,
      error: `Unknown tool: ${toolName}`,
    };
  }

  const validation = validateToolArguments(tool.schema, argumentsObject);

  if (!validation.valid) {
    return {
      success: false,
      tool: toolName,
      error: validation.error,
    };
  }

  try {
    const result = await tool.execute(argumentsObject);

    return {
      success: true,
      tool: toolName,
      result,
    };
  } catch (error) {
    return {
      success: false,
      tool: toolName,
      error: error.message,
    };
  }
}
