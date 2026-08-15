import { ragSearchTool } from "./ragSearchTool.js";

import { calculatorTool } from "./calculatorTool.js";

export const toolRegistry = {
  knowledge_search: ragSearchTool,
  calculator: calculatorTool,
};
