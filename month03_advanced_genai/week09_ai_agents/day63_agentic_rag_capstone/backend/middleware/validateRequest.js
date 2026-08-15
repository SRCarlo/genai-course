export function validateRequest(req, res, next) {
  const { sessionId, question } = req.body || {};

  if (
    !sessionId ||
    typeof sessionId !== "string" ||
    sessionId.trim().length === 0
  ) {
    return res.status(400).json({
      error: "sessionId must be a non-empty string",
    });
  }

  if (
    !question ||
    typeof question !== "string" ||
    question.trim().length === 0
  ) {
    return res.status(400).json({
      error: "question must be a non-empty string",
    });
  }

  if (question.length > 4000) {
    return res.status(400).json({
      error: "question is too long",
    });
  }

  next();
}
