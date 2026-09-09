import { z } from "zod";
import { permissions } from "../security/permissions.js";
import { canReadOrder } from "../security/resource.authorization.js";

const schema = z.object({
  customerId: z.string().min(1).max(100)
});

export const searchOrdersTool = {
  name: "searchOrders",
  permission: permissions.READ_ORDERS,
  schema,
  async execute(args, authContext) {
    // Demo data: replace this with a real order service in production.
    const orders = [
      { id: "ORD-100", userId: "user-123", amount: 1200, status: "PAID" },
      { id: "ORD-101", userId: "user-999", amount: 4500, status: "PAID" }
    ];

    const visible = orders.filter(
      (order) =>
        order.userId === args.customerId &&
        (authContext.user.role === "admin" ||
          canReadOrder({ userId: authContext.user.id, order }) ||
          authContext.user.role === "support" ||
          authContext.user.role === "manager")
    );

    return { tool: this.name, orders: visible };
  }
};
