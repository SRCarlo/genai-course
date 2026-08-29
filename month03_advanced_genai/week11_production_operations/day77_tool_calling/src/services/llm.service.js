import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.groqApiKey,
});

export async function createChatCompletion({
  messages,
  tools = undefined,
  toolChoice = "auto",
}) {
  return await groq.chat.completions.create({
    model: env.groqModel,
    messages,
    tools,
    tool_choice: toolChoice,
    parallel_tool_calls: true,
    reasoning_effort: "low",
  });
}
