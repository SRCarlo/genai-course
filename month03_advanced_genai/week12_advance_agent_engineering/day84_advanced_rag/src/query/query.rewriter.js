export async function rewriteQuery(groq, query, history = []) {
  if (!history.length) {
    return query;
  }

  const conversation = history
    .slice(-6)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  const prompt = `
Rewrite the user's current question into a
standalone search query.

Use the conversation only to resolve references
such as "it", "that", "this", or missing context.

Do not answer the question.

Return only the rewritten search query.

Conversation:
${conversation}

Current question:
${query}
`;

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: "You rewrite questions for information retrieval.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0,
    max_completion_tokens: 150,
  });

  return response.choices[0]?.message?.content?.trim() || query;
}
