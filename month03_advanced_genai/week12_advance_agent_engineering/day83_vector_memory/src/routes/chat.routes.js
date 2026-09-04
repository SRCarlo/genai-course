import express from "express";

export function createChatRouter(memoryAgent) {
  const router = express.Router();

  router.post("/chat", async (req, res) => {
    try {
      const { userId, message } = req.body;

      if (!userId || !message) {
        return res.status(400).json({
          error: "userId and message are required",
        });
      }

      const result = await memoryAgent.chat({
        userId,
        message,
      });

      res.json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Something went wrong",
        message: error.message,
      });
    }
  });

  return router;
}
