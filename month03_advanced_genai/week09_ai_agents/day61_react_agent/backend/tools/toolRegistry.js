import { calculatorTool } from "./calculatorTool.js";

import { searchTool } from "./searchTool.js";

const tools = {
  calculator: calculatorTool,

  search: searchTool,
};

export function getTool(name) {
  return tools[name];
}

export function getAvailableTools() {
  return Object.keys(tools);
}
