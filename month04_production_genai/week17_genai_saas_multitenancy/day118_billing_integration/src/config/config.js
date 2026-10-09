import "dotenv/config";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT_MUST_BE_A_VALID_TCP_PORT");
}

const webhookSecret = process.env.BILLING_WEBHOOK_SECRET;

if (!webhookSecret || webhookSecret === "replace_with_a_long_local_test_secret") {
  throw new Error("SET_A_PRIVATE_BILLING_WEBHOOK_SECRET_IN_DOTENV");
}

export const config = Object.freeze({
  port,
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  webhookSecret,
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b"
});
