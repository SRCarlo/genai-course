import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function generateAnswer({ question, context, requestId }) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful RAG assistant. Answer using the provided context. If the context does not contain enough information, say that you do not have enough information.",
      },
      {
        role: "user",
        content: `Context:\n\n${context}\n\nQuestion:\n\n${question}`,
      },
    ],
    temperature: 0.2,
    max_completion_tokens: 1024,
    include_reasoning: false,
  });
  const message = response.choices?.[0]?.message;
  const usage = response.usage || {};
  return {
    answer: message?.content || "",
    model: response.model || MODEL,
    inputTokens: usage.prompt_tokens || 0,
    outputTokens: usage.completion_tokens || 0,
    totalTokens: usage.total_tokens || 0,
    requestId,
  };
}
