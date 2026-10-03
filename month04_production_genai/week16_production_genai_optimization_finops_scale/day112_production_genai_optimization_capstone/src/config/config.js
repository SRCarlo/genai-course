import "dotenv/config";

const numberEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

export const config = Object.freeze({
  port: numberEnv("PORT", 3000),
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  },
  ai: {
    requestTimeoutMs: numberEnv("REQUEST_TIMEOUT_MS", 10000),
  },
  rateLimit: {
    maxRequests: numberEnv("RATE_LIMIT_MAX", 20),
    windowMs: numberEnv("RATE_LIMIT_WINDOW_MS", 60000),
  },
  cache: { ttlMs: numberEnv("CACHE_TTL_MS", 60000) },
  retry: {
    attempts: numberEnv("RETRY_ATTEMPTS", 2),
    delayMs: numberEnv("RETRY_DELAY_MS", 250),
  },
  circuit: {
    failureThreshold: numberEnv("CIRCUIT_FAILURE_THRESHOLD", 3),
    resetTimeoutMs: numberEnv("CIRCUIT_RESET_TIMEOUT_MS", 10000),
  },
  auth: {
    required: process.env.REQUIRE_AUTH === "true",
    token: process.env.AUTH_TOKEN || "change-me",
  },
  simulation: {
    enabled: process.env.SIMULATE_PROVIDER_FAILURE === "true",
    failureRate: numberEnv("FAILURE_RATE", 0.3),
  },
});
