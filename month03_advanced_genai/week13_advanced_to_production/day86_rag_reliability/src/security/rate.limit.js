import rateLimit from "express-rate-limit";

export const ragRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),

  limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    error: {
      code: "RATE_LIMITED",

      message: "Too many requests. Please try again later.",
    },
  },
});
