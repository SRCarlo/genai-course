import { z } from "zod";

const validators = {
  getOrder: z.object({
    orderId: z.string().regex(/^ORD-\d+$/, "Invalid order ID format"),
  }),

  searchKnowledgeBase: z.object({
    query: z.string().min(1).max(500),
  }),

  calculator: z.object({
    a: z.number().finite(),

    b: z.number().finite(),

    operation: z.enum(["add", "subtract", "multiply", "divide"]),
  }),
};

export function validateToolCall(toolName, args) {
  const validator = validators[toolName];

  if (!validator) {
    return {
      success: false,
      error: "No validator exists for this tool",
    };
  }

  const result = validator.safeParse(args);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid tool arguments",
      details: result.error.issues,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
