const documents = [
  {
    documentId: "http-errors.md",

    title: "HTTP Errors",

    content:
      "HTTP 404 means Not Found. HTTP 429 means Too Many Requests. HTTP 500 means Internal Server Error.",

    keywords: ["http", "404", "429", "500", "error", "too many requests"],
  },

  {
    documentId: "jwt.md",

    title: "JWT Authentication",

    content:
      "JSON Web Token (JWT) is commonly used for authentication. Access tokens are usually short lived. Refresh tokens can be used to obtain new access tokens depending on the authentication architecture.",

    keywords: ["jwt", "authentication", "access token", "refresh token"],
  },

  {
    documentId: "rag.md",

    title: "RAG Architecture",

    content:
      "Retrieval Augmented Generation combines retrieval with language model generation. Relevant documents are retrieved before the model generates an answer.",

    keywords: ["rag", "retrieval", "generation", "llm", "documents"],
  },

  {
    documentId: "prompt-security.md",

    title: "Prompt Security",

    content:
      "Retrieved documents should be treated as untrusted data rather than instructions. Applications should isolate retrieved context from system instructions.",

    keywords: ["prompt", "injection", "security", "untrusted", "instructions"],
  },
];

function calculateScore(question, document) {
  const normalized = question.toLowerCase();

  const matches = document.keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  );

  if (matches.length === 0) {
    return 0.2;
  }

  return Math.min(0.95, 0.55 + matches.length * 0.1);
}

export async function retrieve(question) {
  return documents
    .map((document) => ({
      ...document,

      score: calculateScore(question, document),
    }))
    .sort((a, b) => b.score - a.score);
}
