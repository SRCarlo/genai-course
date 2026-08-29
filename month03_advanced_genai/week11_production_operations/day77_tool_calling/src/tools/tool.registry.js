import { getOrder } from "./get-order.tool.js";
import { searchKnowledgeBase } from "./search.tool.js";
import { calculate } from "./calculator.tool.js";

export const toolRegistry = {
  getOrder: {
    description: "Retrieve order information using a unique order ID.",

    execute: getOrder,

    risk: "low",

    permissions: ["customer", "support", "admin"],

    schema: {
      type: "object",

      properties: {
        orderId: {
          type: "string",
          description: "Unique order ID such as ORD-1001",
        },
      },

      required: ["orderId"],

      additionalProperties: false,
    },
  },

  searchKnowledgeBase: {
    description:
      "Search the customer support knowledge base for policies and information.",

    execute: searchKnowledgeBase,

    risk: "low",

    permissions: ["customer", "support", "admin"],

    schema: {
      type: "object",

      properties: {
        query: {
          type: "string",
          description: "The question or information to search for",
        },
      },

      required: ["query"],

      additionalProperties: false,
    },
  },

  calculator: {
    description:
      "Perform safe arithmetic calculations using two numbers and an allowed operation.",

    execute: calculate,

    risk: "low",

    permissions: ["customer", "support", "admin"],

    schema: {
      type: "object",

      properties: {
        a: {
          type: "number",
          description: "First number",
        },

        b: {
          type: "number",
          description: "Second number",
        },

        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "Allowed arithmetic operation",
        },
      },

      required: ["a", "b", "operation"],

      additionalProperties: false,
    },
  },
};
