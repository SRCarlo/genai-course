import "dotenv/config";

const requiredEnv = [
  "GROQ_API_KEY",
  "ACME_API_KEY",
  "BETA_API_KEY",
  "ENTERPRISE_API_KEY"
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export const config = Object.freeze({
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
  apiKeys: Object.freeze({
    acme: process.env.ACME_API_KEY,
    beta: process.env.BETA_API_KEY,
    enterprise: process.env.ENTERPRISE_API_KEY
  }),
  logLevel: process.env.LOG_LEVEL ?? "info"
});

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}
