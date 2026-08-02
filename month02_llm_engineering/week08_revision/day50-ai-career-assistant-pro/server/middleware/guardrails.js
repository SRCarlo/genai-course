export const validatePrompt = (req, res, next) => {
  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  if (question.length > 4000) {
    return res.status(400).json({
      success: false,
      message: "Question is too long",
    });
  }

  next();
};
