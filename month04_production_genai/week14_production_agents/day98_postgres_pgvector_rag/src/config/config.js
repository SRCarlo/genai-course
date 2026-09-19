import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),
  GROQ_MODEL: z.string().default("openai/gpt-oss-20b"),
  EMBEDDING_MODEL: z.string().default("Xenova/all-MiniLM-L6-v2"),
  EMBEDDING_DIMENSION: z.coerce.number().default(384),
  TOP_K: z.coerce.number().default(5),
  MAX_DISTANCE: z.coerce.number().default(0.75),
  MAX_RETRIES: z.coerce.number().default(3)
});

export const config = envSchema.parse(process.env);
