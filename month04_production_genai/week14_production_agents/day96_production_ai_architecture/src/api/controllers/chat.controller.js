import { chatService } from "../../application/chat.service.js";

export async function chatController(req, res, next) {
  try {
    const { message, conversationId } = req.body;

    const result = await chatService.execute({
      userId: req.user.id,

      tenantId: req.user.tenantId,

      message,

      conversationId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
