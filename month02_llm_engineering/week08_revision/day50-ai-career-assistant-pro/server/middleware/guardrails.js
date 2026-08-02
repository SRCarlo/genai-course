export const validateChatRequest = (req, res, next) => {
  const { sessionId, question } = req.body;

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: "Session ID is required",
    });
  }

  if (!question) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  if (question.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Question is too short",
    });
  }

  if (question.length > 3000) {
    return res.status(400).json({
      success: false,
      message: "Question exceeds 3000 characters",
    });
  }

  next();
};
