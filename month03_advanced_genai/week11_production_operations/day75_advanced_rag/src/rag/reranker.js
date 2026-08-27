import { generateText } from "../services/llm.service.js";

function extractJson(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    return [];
  }

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
}

export async function rerank(query, documents, { finalK = 5 } = {}) {
  if (!documents.length) {
    return [];
  }

  const compactDocuments = documents.map((document, index) => ({
    index,
    id: document.id,
    title: document.title,
    content: document.content.slice(0, 3000),
  }));

  const prompt = `
You are a document relevance reranker.

Rank the documents according to how useful
they are for answering the query.

Query:
${query}

Documents:
${JSON.stringify(compactDocuments, null, 2)}

Return ONLY valid JSON.

Format:
[
  {
    "index": 0,
    "score": 0.95
  }
]

Score from 0 to 1.
Higher means more relevant.
Include every document.
`;

  const output = await generateText(prompt, {
    temperature: 0,
    maxCompletionTokens: 1000,
  });

  const scores = extractJson(output);

  const scoreMap = new Map(
    scores.map((item) => [Number(item.index), Number(item.score)]),
  );

  return documents
    .map((document, index) => ({
      ...document,
      rerankScore: scoreMap.get(index) ?? 0,
    }))
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, finalK);
}
