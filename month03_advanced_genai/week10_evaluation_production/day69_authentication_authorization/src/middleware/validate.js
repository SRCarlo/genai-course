export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  next();
}

export function validateRegister(req, res, next) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  next();
}

export function validateChatInput(req, res, next) {
  const { message } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      error: "message is required",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      error: "message is too long",
    });
  }

  next();
}
