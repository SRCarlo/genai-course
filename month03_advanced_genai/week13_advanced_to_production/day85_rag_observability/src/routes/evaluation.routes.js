import express from "express";

export function createEvaluationRoutes(
  evaluationRunner
) {
  const router =
    express.Router();

  let lastReport = null;

  router.post(
    "/run",
    async (req, res) => {
      try {
        lastReport =
          await evaluationRunner();

        return res.json(
          lastReport
        );
      } catch (error) {
        return res
          .status(500)
          .json({
            error:
              "Evaluation failed",
            message:
              error.message
          });
      }
    }
  );

  router.get(
    "/metrics",
    (req, res) => {
      if (!lastReport) {
        return res.json({
          message:
            "No evaluation has been run yet."
        });
      }

      return res.json(
        lastReport
      );
    }
  );

  return router;
}