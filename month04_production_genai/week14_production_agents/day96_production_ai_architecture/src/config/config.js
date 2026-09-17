import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),

  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),

  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),

  GROQ_MODEL: z.string().default("openai/gpt-oss-20b"),

  MAX_TOKENS: z.coerce.number().default(1000),

  MAX_ITERATIONS: z.coerce.number().default(8),

  MAX_TOOL_CALLS: z.coerce.number().default(10),

  MAX_EXECUTION_MS: z.coerce.number().default(15000),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");

  console.error(parsed.error.flatten().fieldErrors);

  process.exit(1);
}

export const config = {
  port: parsed.data.PORT,

  environment: parsed.data.NODE_ENV,

  groq: {
    apiKey: parsed.data.GROQ_API_KEY,
    model: parsed.data.GROQ_MODEL,
  },

  ai: {
    maxTokens: parsed.data.MAX_TOKENS,
    maxIterations: parsed.data.MAX_ITERATIONS,
    maxToolCalls: parsed.data.MAX_TOOL_CALLS,
    maxExecutionMs: parsed.data.MAX_EXECUTION_MS,
  },

  rateLimit: {
    windowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
    maxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,
  },
};
