import express from "express";

export function createRagRoutes(
  ragService
) {
  const router =
    express.Router();

  router.post(
    "/query",
    async (req, res) => {
      try {
        const {
          question
        } = req.body;

        if (
          typeof question !==
            "string" ||
          !question.trim()
        ) {
          return res
            .status(400)
            .json({
              error:
                "question is required"
            });
        }

        const result =
          await ragService.query(
            question
          );

        return res.json(result);
      } catch (error) {
        return res
          .status(500)
          .json({
            error:
              "RAG request failed",
            message:
              error.message
          });
      }
    }
  );

  return router;
}