import { getTool } from "../tools/toolRegistry.js";

export async function executeAction(action) {
  if (!action) {
    throw new Error("Action is required");
  }

  if (action.type !== "tool") {
    throw new Error(`Unsupported action type: ${action.type}`);
  }

  if (!action.tool) {
    throw new Error("Tool name is required");
  }

  const tool = getTool(action.tool);

  if (!tool) {
    throw new Error(`Tool not allowed: ${action.tool}`);
  }

  return await tool(action.input || {});
}
