import rateLimit from "express-rate-limit";

import { config } from "../config/env.js";

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,

  limit: config.rateLimitMaxRequests,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});
