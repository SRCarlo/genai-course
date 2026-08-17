import {
  startSpan,
  endSpan,
  recordSpanError,
} from "../observability/tracer.js";

const documents = [
  {
    id: "doc_001",
    source: "refund-policy.txt",
    text: `
Customers can request a refund within
30 days of purchase if the product has
not been substantially used.
`,
  },

  {
    id: "doc_002",
    source: "bonus-policy.txt",
    text: `
Employees receive a performance bonus
according to company policy.
For calculation examples, a 10 percent
bonus on 60000 is 6000.
`,
  },

  {
    id: "doc_003",
    source: "leave-policy.txt",
    text: `
Employees are eligible for paid leave
according to their employment category.
`,
  },
];

function calculateScore(query, text) {
  const queryWords = query.toLowerCase().split(/\s+/);

  const documentWords = text.toLowerCase().split(/\s+/);

  let score = 0;

  for (const word of queryWords) {
    if (word.length > 2 && documentWords.includes(word)) {
      score += 1;
    }
  }

  return score;
}

export async function searchKnowledge({ query, trace, topK = 3 }) {
  const ragSpan = startSpan(trace, "rag.search", {
    query,
    topK,
  });

  trace.summary.ragCalls += 1;

  try {
    const vectorSpan = startSpan(
      trace,
      "vector.search",
      {
        query,
        topK,
      },
      ragSpan.spanId,
    );

    const results = documents
      .map((document) => ({
        ...document,

        score: calculateScore(query, document.text),
      }))
      .filter((document) => document.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    endSpan(vectorSpan, "success");

    ragSpan.attributes = {
      ...ragSpan.attributes,

      resultCount: results.length,

      sources: results.map((result) => ({
        documentId: result.id,

        source: result.source,

        score: result.score,
      })),
    };

    endSpan(ragSpan, "success");

    return results;
  } catch (error) {
    recordSpanError(ragSpan, error);

    throw error;
  }
}
