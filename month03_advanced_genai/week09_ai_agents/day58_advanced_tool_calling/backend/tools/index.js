import {
  calculatorSchema,
  timeSchema,
  knowledgeSchema,
} from "../schemas/toolSchemas.js";

import { calculatorTool } from "./calculatorTool.js";

import { timeTool } from "./timeTool.js";

import { knowledgeTool } from "./knowledgeTool.js";

export const tools = [
  {
    schema: calculatorSchema,
    execute: calculatorTool.execute,
  },

  {
    schema: timeSchema,
    execute: timeTool.execute,
  },

  {
    schema: knowledgeSchema,
    execute: knowledgeTool.execute,
  },
];
