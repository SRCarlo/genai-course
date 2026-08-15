import { callLLM } from "../services/llmService.js";

export async function rewriteQuery(question, history = []) {
  if (!question || typeof question !== "string") {
    throw new Error("Question is required");
  }

  if (!history || history.length === 0) {
    return question;
  }

  const historyText = history
    .map((message) => {
      return `${message.role}: ${message.content}`;
    })
    .join("\n");

  const messages = [
    {
      role: "system",
      content: `
You rewrite conversational questions into standalone search queries.

Rules:
- Preserve the user's original meaning.
- Use conversation history when the question contains references such as:
  "it", "its", "that", "this", "they", etc.
- Return ONLY the rewritten search query.
- Do not answer the question.
- Do not invent information.
`,
    },
    {
      role: "user",
      content: `
Conversation history:

${historyText}

Current question:

${question}

Rewrite the current question as a standalone search query.
`,
    },
  ];

  const rewritten = await callLLM(messages, {
    temperature: 0,
  });

  return rewritten.trim();
}
