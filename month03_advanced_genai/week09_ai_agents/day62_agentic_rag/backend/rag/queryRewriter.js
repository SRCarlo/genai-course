import { chatCompletion } from "../services/llmService.js";

function needsRewrite(question, conversation = []) {
  if (!conversation || conversation.length === 0) {
    return false;
  }

  const lower = question.toLowerCase();

  const contextWords = [
    "it",
    "that",
    "this",
    "they",
    "them",
    "those",
    "the second one",
    "the first one",
    "its",
    "their",
    "same policy",
    "that policy",
  ];

  return contextWords.some((word) => lower.includes(word));
}

function formatConversation(conversation) {
  return conversation
    .slice(-6)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");
}

export async function rewriteQuery(question, conversation = []) {
  if (!needsRewrite(question, conversation)) {
    return question.trim();
  }

  const history = formatConversation(conversation);

  const systemPrompt = `
You are a retrieval query rewriting assistant.

Convert the user's latest question into
a standalone search query.

Rules:
- Preserve the user's intent.
- Resolve pronouns using conversation history.
- Include important entities.
- Do not answer the question.
- Return ONLY the rewritten query.
- Keep it concise.
`;

  const userPrompt = `
Conversation:

${history}

Latest question:
${question}

Standalone retrieval query:
`;

  const rewritten = await chatCompletion({
    systemPrompt,
    userPrompt,
    temperature: 0,
    maxTokens: 200,
  });

  return rewritten.trim().replace(/^["']|["']$/g, "");
}
