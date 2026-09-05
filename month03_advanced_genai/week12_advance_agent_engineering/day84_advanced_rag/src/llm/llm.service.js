export async function generateAnswer(groq, query, context) {
  const prompt = `
You are a reliable production RAG assistant.

Answer the user's question using ONLY the supplied
context.

Rules:

1. Do not invent facts.
2. Do not use outside knowledge.
3. If the context does not contain enough information,
   clearly say that the available documents do not
   contain enough information.
4. Keep the answer concise but useful.
5. When making factual claims, refer to the supplied
   sources.

Context:
${context}

User question:
${query}
`;

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: "You answer questions using retrieved context.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0,
    max_completion_tokens: 600,
  });

  return (
    response.choices[0]?.message?.content || "I could not generate an answer."
  );
}
