import { z } from "zod";

export const searchOrdersTool = {
  name: "searchOrders",

  description: "Search orders using a customer ID or order status.",

  permission: "order:read",

  risk: "LOW",

  inputSchema: z.object({
    customerId: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    status: z
      .enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      ])
      .optional()
  }),

  outputSchema: z.object({
    orders: z.array(
      z.object({
        orderId: z.string(),
        customerId: z.string(),
        status: z.string(),
        amount: z.number()
      })
    )
  }),

  execute: async ({ customerId, status }) => {
    const orders = [
      {
        orderId: "10001",
        customerId: "customer-101",
        status: "shipped",
        amount: 4999
      },
      {
        orderId: "10002",
        customerId: "customer-102",
        status: "processing",
        amount: 2999
      },
      {
        orderId: "10003",
        customerId: "customer-101",
        status: "delivered",
        amount: 7999
      }
    ];

    const filteredOrders = orders.filter((order) => {
      const matchesCustomer =
        !customerId || order.customerId === customerId;

      const matchesStatus =
        !status || order.status === status;

      return matchesCustomer && matchesStatus;
    });

    return {
      orders: filteredOrders
    };
  }
};