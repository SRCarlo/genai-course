import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["JWT_SECRET", "GROQ_API_KEY"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT || 3000),

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",

  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  groqApiKey: process.env.GROQ_API_KEY,

  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

  freeDailyQuota: Number(process.env.FREE_DAILY_QUOTA || 10),

  proDailyQuota: Number(process.env.PRO_DAILY_QUOTA || 1000),

  enterpriseDailyQuota: Number(process.env.ENTERPRISE_DAILY_QUOTA || 10000),

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),

  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20),
};
