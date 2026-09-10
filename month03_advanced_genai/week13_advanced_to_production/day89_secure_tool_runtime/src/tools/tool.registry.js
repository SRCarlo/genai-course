import { getOrderTool } from "./get.order.js";
import { searchOrdersTool } from "./search.orders.js";
import { refundOrderTool } from "./refund.order.js";
import { deleteCustomerTool } from "./delete.customer.js";

export const toolRegistry = {
  getOrder: getOrderTool,
  searchOrders: searchOrdersTool,
  refundOrder: refundOrderTool,
  deleteCustomer: deleteCustomerTool
};

export function getTool(toolName) {
  return toolRegistry[toolName] ?? null;
}

export function getAllTools() {
  return Object.values(toolRegistry);
}