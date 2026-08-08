import axios from "axios";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

const LLM_MODEL = process.env.LLM_MODEL || "llama3.2:3b";

export async function rerank(query, documents) {
  const candidates = documents.slice(0, Number(process.env.RERANK_TOP_K || 8));

  if (candidates.length === 0) {
    return [];
  }

  const scored = [];

  for (const document of candidates) {
    const prompt = `
You are a document relevance judge.

Score how relevant the document is to the question.

Return ONLY a number from 0 to 10.

Question:
${query}

Document:
${document.text}
`;

    try {
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/generate`,
        {
          model: LLM_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0,
          },
        },
        {
          timeout: 120000,
        },
      );

      const raw = response.data.response || "";

      const match = raw.match(/\b(10|[0-9])\b/);

      const rerankScore = match ? Number(match[1]) : 0;

      scored.push({
        ...document,
        rerankScore,
      });
    } catch (error) {
      console.error("Reranker error:", error.message);

      scored.push({
        ...document,
        rerankScore: document.hybridScore || 0,
      });
    }
  }

  return scored
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, Number(process.env.CONTEXT_TOP_K || 4));
}
