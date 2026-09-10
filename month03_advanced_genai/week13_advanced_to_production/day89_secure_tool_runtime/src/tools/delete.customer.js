import { z } from "zod";

export const deleteCustomerTool = {
  name: "deleteCustomer",

  description: "Delete a customer account.",

  permission: "customer:delete",

  risk: "CRITICAL",

  inputSchema: z.object({
    customerId: z
      .string()
      .trim()
      .min(1)
      .max(100)
  }),

  outputSchema: z.object({
    customerId: z.string(),
    deleted: z.boolean()
  }),

  execute: async ({ customerId }) => {
    // Demo implementation.
    // Never directly expose database deletion to the LLM.

    return {
      customerId,
      deleted: true
    };
  }
};