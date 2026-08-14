import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function agentCompletion({ messages, tools }) {
  console.log("Sending messages to Groq:", messages.length);

  return await groq.chat.completions.create({
    model: MODEL,

    messages,

    tools,

    tool_choice: "auto",

    parallel_tool_calls: false,

    temperature: 0.1,

    /*
     * Keep generated output small.
     */
    max_completion_tokens: 1000,
  });
}
