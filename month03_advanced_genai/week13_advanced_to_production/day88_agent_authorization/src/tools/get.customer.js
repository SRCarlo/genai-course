import { z } from "zod";
import { permissions } from "../security/permissions.js";

const schema = z.object({
  customerId: z.string().min(1).max(100)
});

export const getCustomerTool = {
  name: "getCustomer",
  permission: permissions.READ_CUSTOMERS,
  schema,
  async execute(args, authContext) {
    const customer = {
      id: args.customerId,
      name: "Demo Customer",
      email: "customer@example.com"
    };

    const allowed =
      authContext.user.role === "admin" ||
      authContext.user.role === "support" ||
      authContext.user.role === "manager" ||
      authContext.user.id === customer.id;

    if (!allowed) throw new Error("RESOURCE_NOT_AUTHORIZED");

    return { tool: this.name, customer };
  }
};
