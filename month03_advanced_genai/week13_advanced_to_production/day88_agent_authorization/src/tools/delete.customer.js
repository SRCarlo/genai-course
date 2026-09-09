import { z } from "zod";
import { permissions } from "../security/permissions.js";

const schema = z.object({
  customerId: z.string().min(1).max(100),
  reason: z.string().min(3).max(500)
});

export const deleteCustomerTool = {
  name: "deleteCustomer",
  permission: permissions.DELETE_CUSTOMER,
  schema,
  async execute(args) {
    return {
      tool: this.name,
      status: "DELETED",
      customerId: args.customerId,
      reason: args.reason
    };
  }
};
