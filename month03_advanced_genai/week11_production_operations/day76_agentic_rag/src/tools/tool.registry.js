import { searchKnowledgeBase } from "./search.tool.js";
import { calculate } from "./calculator.tool.js";
import { getOrder } from "./order.tool.js";

export const tools = {
  searchKnowledgeBase: {
    description:
      "Search internal company documentation for policies, " +
      "refund rules, shipping policies, product documentation, " +
      "and other knowledge-base information.",

    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The exact information that should be searched for.",
        },
      },
      required: ["query"],
    },

    execute: searchKnowledgeBase,

    permissions: ["knowledge:read"],

    timeoutMs: 5000,
  },

  calculator: {
    description:
      "Perform safe arithmetic calculations such as addition, " +
      "subtraction, multiplication, division, percentages, " +
      "and parentheses.",

    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description:
            "A mathematical expression containing numbers and arithmetic operators.",
        },
      },
      required: ["expression"],
    },

    execute: calculate,

    permissions: ["calculator:use"],

    timeoutMs: 2000,
  },

  getOrder: {
    description:
      "Retrieve information about a customer order using its order ID.",

    parameters: {
      type: "object",
      properties: {
        orderId: {
          type: "string",
          description: "The customer order ID, for example ORD-123.",
        },
      },
      required: ["orderId"],
    },

    execute: getOrder,

    permissions: ["orders:read"],

    timeoutMs: 5000,
  },
};

export function getToolDefinitions() {
  return Object.entries(tools).map(([name, tool]) => ({
    type: "function",

    function: {
      name,

      description: tool.description,

      parameters: tool.parameters,
    },
  }));
}
