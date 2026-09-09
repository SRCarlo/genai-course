import { searchOrdersTool } from "./search.orders.js";
import { getCustomerTool } from "./get.customer.js";
import { refundOrderTool } from "./refund.order.js";
import { deleteCustomerTool } from "./delete.customer.js";

export const tools = Object.freeze({
  searchOrders: searchOrdersTool,
  getCustomer: getCustomerTool,
  refundOrder: refundOrderTool,
  deleteCustomer: deleteCustomerTool
});
