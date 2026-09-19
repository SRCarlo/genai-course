export function createChatController(chatService) {
  return {
    chat: async (req, res, next) => {
      try {
        const { question } = req.body;

        if (!question || !String(question).trim()) {
          return res.status(400).json({
            error: "question is required"
          });
        }

        const result = await chatService.answer({
          question: String(question).trim(),
          tenantId: req.auth.tenantId
        });

        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  };
}
