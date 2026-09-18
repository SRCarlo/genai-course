import { z } from "zod";

const chatSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(2000, "Question cannot exceed 2000 characters"),
});

export function createChatController(chatService) {
  return async function chatController(req, res, next) {
    try {
      const input = chatSchema.parse(req.body);

      const result = await chatService.ask({
        question: input.question,

        tenantId: req.user.tenantId,

        userId: req.user.id,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
