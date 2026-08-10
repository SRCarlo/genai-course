import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function callLLM({ messages, tools }) {
  const response = await groq.chat.completions.create({
    model: MODEL,

    messages,

    tools,

    tool_choice: "auto",

    temperature: 0.2,

    max_completion_tokens: 2048,
  });

  const message = response.choices[0].message;

  if (message.tool_calls && message.tool_calls.length > 0) {
    return {
      type: "tool_calls",

      toolCalls: message.tool_calls.map((toolCall) => ({
        id: toolCall.id,

        name: toolCall.function.name,

        arguments: toolCall.function.arguments,
      })),

      assistantMessage: message,
    };
  }

  return {
    type: "final",

    content: message.content || "",

    assistantMessage: message,
  };
}
