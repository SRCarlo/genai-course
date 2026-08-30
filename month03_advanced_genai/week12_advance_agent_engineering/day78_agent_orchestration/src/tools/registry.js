import { getOrder, cancelOrder } from "./order.tool.js";

import { searchKnowledgeBase } from "./search.tool.js";

import { calculate } from "./calculator.tool.js";

export const toolRegistry = {
  getOrder: {
    name: "getOrder",

    description: "Retrieve order information.",

    risk: "low",

    execute: getOrder,
  },

  searchKnowledgeBase: {
    name: "searchKnowledgeBase",

    description: "Search support policies.",

    risk: "low",

    execute: searchKnowledgeBase,
  },

  calculate: {
    name: "calculate",

    description: "Perform a mathematical calculation.",

    risk: "low",

    execute: calculate,
  },

  cancelOrder: {
    name: "cancelOrder",

    description: "Cancel an order.",

    risk: "high",

    requiresApproval: true,

    execute: cancelOrder,
  },
};
