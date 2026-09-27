import "dotenv/config";

export const config = {
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

  inputPricePerMillion: Number(process.env.INPUT_PRICE_PER_MILLION || 0),
  outputPricePerMillion: Number(process.env.OUTPUT_PRICE_PER_MILLION || 0),

  dailyBudget: Number(process.env.DAILY_BUDGET || 10),
  monthlyBudget: Number(process.env.MONTHLY_BUDGET || 100),
  tenantBudget: Number(process.env.TENANT_BUDGET || 5),

  maxInputTokens: Number(process.env.MAX_INPUT_TOKENS || 8000),
  maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS || 1500),
  maxContextTokens: Number(process.env.MAX_CONTEXT_TOKENS || 4000),
  maxToolCalls: Number(process.env.MAX_TOOL_CALLS || 5),
  maxRetries: Number(process.env.MAX_RETRIES || 2),

  enableLiveGroq: process.env.ENABLE_LIVE_GROQ === "true"
};