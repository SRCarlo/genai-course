import { calculatorTool } from "../tools/calculatorTool.js";
import { timeTool } from "../tools/timeTool.js";

export const tools = [calculatorTool, timeTool];

/*
 * Find a tool by name.
 */
export function getTool(toolName) {
  return tools.find((tool) => tool.name === toolName);
}
