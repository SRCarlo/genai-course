/**
 * Calculate a basic arithmetic expression.
 *
 * This is intentionally limited for learning.
 */
export function calculate(expression) {
  const cleaned = expression.trim();

  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error("Only basic arithmetic expressions are allowed.");
  }

  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${cleaned})`)();

  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("Invalid calculation.");
  }

  return result;
}

/**
 * Execute a tool by name.
 */
export async function executeTool(toolName, argumentsObject) {
  switch (toolName) {
    case "calculator":
      return calculate(argumentsObject.expression);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
