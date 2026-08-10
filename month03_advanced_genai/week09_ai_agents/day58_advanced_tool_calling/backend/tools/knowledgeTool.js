const knowledgeBase = [
  {
    id: 1,
    title: "Express Middleware",
    content:
      "Express middleware functions have access to the request object, response object, and next function. Middleware can execute code, modify request or response objects, end the request-response cycle, or call next().",
  },

  {
    id: 2,
    title: "Node.js",
    content:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It is commonly used for backend APIs, web servers, automation, and AI application services.",
  },

  {
    id: 3,
    title: "RAG",
    content:
      "Retrieval-Augmented Generation combines information retrieval with language generation. Relevant documents are retrieved and provided to the language model as context.",
  },

  {
    id: 4,
    title: "AI Agents",
    content:
      "An AI agent uses an LLM to decide actions, execute tools, observe results, and continue reasoning until it can provide a final answer.",
  },
];

export const knowledgeTool = {
  async execute({ query }) {
    const normalizedQuery = query.toLowerCase();

    const words = normalizedQuery.split(/\s+/).filter(Boolean);

    const results = knowledgeBase
      .map((document) => {
        const text = `${document.title} ${document.content}`.toLowerCase();

        let score = 0;

        for (const word of words) {
          if (text.includes(word)) {
            score++;
          }
        }

        return {
          ...document,
          score,
        };
      })
      .filter((document) => document.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      query,
      results: results.map((document) => ({
        id: document.id,
        title: document.title,
        content: document.content,
        score: document.score,
      })),
    };
  },
};
