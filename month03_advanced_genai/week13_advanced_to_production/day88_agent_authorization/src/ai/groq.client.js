import Groq from "groq-sdk";
import "dotenv/config";

const apiKey = process.env.GROQ_API_KEY;

export const groq = apiKey
  ? new Groq({ apiKey })
  : null;

export const GROQ_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-20b";
