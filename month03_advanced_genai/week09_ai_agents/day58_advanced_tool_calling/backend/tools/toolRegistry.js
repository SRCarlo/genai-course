import { tools } from "./index.js";

export function getTool(toolName) {
  return tools.find((tool) => tool.schema.function.name === toolName);
}

export function getToolSchemas() {
  return tools.map((tool) => tool.schema);
}
