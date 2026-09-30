import { mockLLM } from "./mock-llm.js";
import { groqLLM } from "./groq-llm.js";
import { config } from "../config/load-config.js";

export async function runLLM(payload) {
  if (config.llmProvider === "groq") {
    return groqLLM(payload);
  }

  return mockLLM(payload);
}
