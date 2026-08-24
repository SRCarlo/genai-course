import "dotenv/config";

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT || 3000),

  groqApiKey: process.env.GROQ_API_KEY || "",

  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  inputPricePerMillion: Number(process.env.AI_INPUT_PRICE_PER_MILLION || 0.075),

  outputPricePerMillion: Number(process.env.AI_OUTPUT_PRICE_PER_MILLION || 0.3),

  logLevel: process.env.LOG_LEVEL || "info",

  dailyCostAlertUsd: Number(process.env.AI_COST_DAILY_ALERT_USD || 50),

  errorRateAlertPercent: Number(process.env.AI_ERROR_RATE_ALERT_PERCENT || 5),

  p95LatencyAlertMs: Number(process.env.AI_P95_LATENCY_ALERT_MS || 5000),

  otelServiceName: process.env.OTEL_SERVICE_NAME || "day72-genai-observability",

  otelServiceVersion: process.env.OTEL_SERVICE_VERSION || "1.0.0",
};

export function validateProductionConfig() {
  if (env.nodeEnv === "production" && !env.groqApiKey) {
    required("GROQ_API_KEY");
  }
}
