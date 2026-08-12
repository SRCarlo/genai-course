import { calculatorTool } from "./calculatorTool.js";

import { searchTool } from "./searchTool.js";

const tools = {
  calculator: calculatorTool,

  search: searchTool,
};

export function getTool(name) {
  return tools[name] ?? null;
}

export function getAvailableTools() {
  return Object.keys(tools);
}

export function hasTool(name) {
  return Boolean(tools[name]);
}
