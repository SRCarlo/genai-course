import { toolRegistry } from "./tool.registry.js";

export function getToolDefinitions() {
  return Object.entries(toolRegistry).map(([name, tool]) => ({
    type: "function",

    function: {
      name,

      description: tool.description,

      parameters: tool.schema,
    },
  }));
}
