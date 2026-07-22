export function validateMessage(req, res, next) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,

      error: "Message is required",
    });
  }

  next();
}
