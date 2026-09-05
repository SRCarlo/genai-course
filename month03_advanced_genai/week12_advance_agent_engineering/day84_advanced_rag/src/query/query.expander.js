export async function expandQuery(groq, query) {
  const prompt = `
Generate up to 3 alternative search queries
for the user's question.

The alternatives should improve retrieval recall.

Keep technical terms, identifiers,
error codes, product names, and API names intact.

Return one query per line.
Do not number the lines.

Original query:
${query}
`;

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: "You generate search-query variations.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,
    max_completion_tokens: 200,
  });

  const content = response.choices[0]?.message?.content || "";

  return [
    query,
    ...content
      .split("\n")
      .map((line) =>
        line
          .replace(/^[-*•]\s*/, "")
          .replace(/^\d+[.)]\s*/, "")
          .trim(),
      )
      .filter(Boolean),
  ];
}
