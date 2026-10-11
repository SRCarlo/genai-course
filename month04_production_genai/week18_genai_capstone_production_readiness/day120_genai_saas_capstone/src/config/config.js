import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  GROQ_API_KEY: z.string().optional().default(''),
  GROQ_MODEL: z.string().min(1).default('openai/gpt-oss-20b'),
  GROQ_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CHAT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60000),
  CHAT_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(20),
  MAX_QUESTION_LENGTH: z.coerce.number().int().min(1).max(20000).default(4000),
  MAX_CONTEXT_CHARACTERS: z.coerce.number().int().min(1000).max(100000).default(16000),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`INVALID_ENVIRONMENT_CONFIGURATION: ${details}`);
}

export const config = Object.freeze({
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  logLevel: parsed.data.LOG_LEVEL,
  groqApiKey: parsed.data.GROQ_API_KEY,
  groqModel: parsed.data.GROQ_MODEL,
  groqTimeoutMs: parsed.data.GROQ_TIMEOUT_MS,
  corsOrigin: parsed.data.CORS_ORIGIN,
  chatRateLimitWindowMs: parsed.data.CHAT_RATE_LIMIT_WINDOW_MS,
  chatRateLimitMax: parsed.data.CHAT_RATE_LIMIT_MAX,
  maxQuestionLength: parsed.data.MAX_QUESTION_LENGTH,
  maxContextCharacters: parsed.data.MAX_CONTEXT_CHARACTERS,
});
