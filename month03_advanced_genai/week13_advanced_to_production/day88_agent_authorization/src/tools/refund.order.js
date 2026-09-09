import { z } from "zod";
import { permissions } from "../security/permissions.js";

const schema = z.object({
  orderId: z.string().min(1).max(100),
  reason: z.string().min(3).max(500)
});

export const refundOrderTool = {
  name: "refundOrder",
  permission: permissions.REFUND_ORDERS,
  schema,
  async execute(args) {
    return {
      tool: this.name,
      status: "REFUNDED",
      orderId: args.orderId,
      reason: args.reason
    };
  }
};
