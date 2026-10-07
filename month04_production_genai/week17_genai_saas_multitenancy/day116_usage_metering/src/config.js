import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
  defaultTenantId: process.env.DEFAULT_TENANT_ID ?? "tenant-acme",
  defaultUserId: process.env.DEFAULT_USER_ID ?? "user-003",
  defaultApiKeyId: process.env.DEFAULT_API_KEY_ID ?? "key_demo",
  demoApiKey: process.env.DEMO_API_KEY ?? "day116-demo-key"
};

export function validateConfig() {
  if (!config.groqApiKey) {
    throw new Error("GROQ_API_KEY is required. Add it to .env.");
  }
}
