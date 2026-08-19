const requiredEnv = ["GROQ_API_KEY"];

export function validateEnv() {
  const missing = [];

  for (const key of requiredEnv) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT || 3000),

  groqApiKey: process.env.GROQ_API_KEY,

  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  maxRequestSize: process.env.MAX_REQUEST_SIZE || "1mb",

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),

  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30),
};
