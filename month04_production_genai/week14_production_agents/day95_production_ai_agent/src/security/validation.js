import { z } from "zod";

const schemas = {
  getOrder: z.object({
    orderId: z.string().regex(/^ORD-\d+$/i).nullable()
  }),
  searchKnowledge: z.object({
    query: z.string().min(1).max(500)
  }),
  getCustomer: z.object({
    customerId: z.string().regex(/^CUST-\d+$/i).nullable()
  }),
  updateCustomer: z.object({
    customerId: z.string().regex(/^CUST-\d+$/i),
    email: z.string().email()
  })
};

const allowedTools = new Set(Object.keys(schemas));

export function validateToolName(toolName) {
  if (!allowedTools.has(toolName)) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
}

export function validateToolArguments(toolName, args) {
  validateToolName(toolName);

  const parsed = schemas[toolName].safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for ${toolName}`);
  }

  return parsed.data;
}

export function getToolSchema(toolName) {
  validateToolName(toolName);
  return schemas[toolName];
}
