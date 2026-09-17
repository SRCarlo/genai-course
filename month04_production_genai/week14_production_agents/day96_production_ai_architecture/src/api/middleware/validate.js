import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(4000, "Message is too long"),

  conversationId: z.string().optional(),
});

export function validate(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body.",
          details: result.error.flatten(),
        },
      });
    }

    req.body = result.data;

    next();
  };
}
