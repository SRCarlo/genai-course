import { generateText } from "../services/llm.service.js";

export async function rewriteQuery(query, conversation = "") {
  if (!conversation?.trim()) {
    return query;
  }

  const prompt = `
Rewrite the user's latest question into
a standalone retrieval query.

The query will be used for document retrieval.

Do not answer the question.

Do not add information that is not supported
by the conversation.

Return ONLY the rewritten query.

Conversation:
${conversation}

Latest user question:
${query}
`;

  return generateText(prompt, {
    temperature: 0.1,
    maxCompletionTokens: 300,
  });
}
