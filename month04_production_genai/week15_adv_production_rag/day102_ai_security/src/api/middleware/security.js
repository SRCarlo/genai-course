import {
  checkRateLimit,
  validateQuestion,
  runInputGuardrails,
} from "../../security/index.js";

export function securityMiddleware(req, res, next) {
  try {
    const key = req.user?.id || req.ip || "anonymous";

    if (
      !checkRateLimit(
        key,
        Number(process.env.RATE_LIMIT || 10),
        Number(process.env.RATE_WINDOW_MS || 60000),
      )
    ) {
      return res.status(429).json({
        error: "Rate limit exceeded",
      });
    }

    const question = validateQuestion(req.body?.question);
    const guard = runInputGuardrails(question);

    if (!guard.allowed) {
      return res.status(400).json({
        error: "Request rejected by input guardrails",
        reason: guard.reason,
      });
    }

    req.question = question;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}
