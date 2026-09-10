import { z } from "zod";

export const getOrderTool = {
  name: "getOrder",

  description: "Retrieve order information using an order ID.",

  permission: "order:read",

  risk: "LOW",

  inputSchema: z.object({
    orderId: z
      .string()
      .trim()
      .min(1, "Order ID is required")
      .max(100, "Order ID is too long")
  }),

  outputSchema: z.object({
    orderId: z.string(),
    status: z.string(),
    amount: z.number()
  }),

  execute: async ({ orderId }) => {
    // Demo data.
    // In production this would call a database/service.
    return {
      orderId,
      status: "shipped",
      amount: 4999
    };
  }
};