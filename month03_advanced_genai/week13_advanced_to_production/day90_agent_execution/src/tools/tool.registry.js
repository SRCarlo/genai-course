import { getOrder } from "./get.order.js";

import { checkRefundEligibility } from "./check.refund.js";

import { refundOrder } from "./refund.order.js";

export const toolRegistry = {
  getOrder: {
    execute: getOrder,
    risk: "low",
  },

  checkRefundEligibility: {
    execute: checkRefundEligibility,
    risk: "low",
  },

  refundOrder: {
    execute: refundOrder,
    risk: "high",
  },
};

export function getTool(toolName) {
  const tool = toolRegistry[toolName];

  if (!tool) {
    const error = new Error(`Tool '${toolName}' not found`);

    error.code = "TOOL_NOT_FOUND";

    throw error;
  }

  return tool;
}
