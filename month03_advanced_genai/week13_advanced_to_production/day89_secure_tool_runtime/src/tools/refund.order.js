import { z } from "zod";

export const refundOrderTool = {
  name: "refundOrder",

  description: "Refund an order.",

  permission: "order:refund",

  risk: "HIGH",

  inputSchema: z.object({
    orderId: z
      .string()
      .trim()
      .min(1)
      .max(100),

    reason: z
      .string()
      .trim()
      .min(3)
      .max(500)
  }),

  outputSchema: z.object({
    orderId: z.string(),
    refunded: z.boolean()
  }),

  execute: async ({ orderId }) => {
    // Demo implementation.
    // Production version would call a payment service.

    return {
      orderId,
      refunded: true
    };
  }
};