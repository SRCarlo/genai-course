import "dotenv/config";

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

export const config = {
  port: numberEnv("PORT", 3000),
  llmProvider: process.env.LLM_PROVIDER || "mock",
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  mockLatencyMs: numberEnv("MOCK_LATENCY_MS", 500),
  maxConcurrentLLM: numberEnv("MAX_CONCURRENT_LLM", 5),
  maxQueueSize: numberEnv("MAX_QUEUE_SIZE", 100),
  requestTimeoutMs: numberEnv("REQUEST_TIMEOUT_MS", 30000),
  rateLimitWindowMs: numberEnv("RATE_LIMIT_WINDOW_MS", 60000),
  rateLimitMax: numberEnv("RATE_LIMIT_MAX", 100)
};

if (config.llmProvider === "groq" && !config.groqApiKey) {
  throw new Error("GROQ_API_KEY is required when LLM_PROVIDER=groq");
}
