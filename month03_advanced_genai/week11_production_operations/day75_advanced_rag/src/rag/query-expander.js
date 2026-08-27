import { generateText } from "../services/llm.service.js";

export async function expandQuery(query) {
  const prompt = `
Generate 3 alternative retrieval queries
for the following user question.

The goal is to improve recall.

Rules:
- Preserve the original intent.
- Use different useful terminology.
- Do not answer the question.
- Return exactly 3 lines.
- Do not number the lines.

User query:
${query}
`;

  const output = await generateText(prompt, {
    temperature: 0.2,
    maxCompletionTokens: 300,
  });

  return output
    .split("\n")
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}
