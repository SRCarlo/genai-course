const knowledgeBase = [
  {
    keywords: ["node", "nodejs", "node.js"],

    title: "Node.js",

    summary:
      "Node.js is a JavaScript runtime commonly used for backend APIs, services, command-line tools and real-time applications.",
  },

  {
    keywords: ["express", "expressjs", "express.js"],

    title: "Express.js",

    summary:
      "Express.js is a lightweight Node.js web framework commonly used to build HTTP APIs and backend services.",
  },

  {
    keywords: ["next", "nextjs", "next.js"],

    title: "Next.js",

    summary:
      "Next.js is a React framework supporting full-stack applications, routing, server-side rendering and backend capabilities.",
  },
];

export async function searchTool(input = {}) {
  const query = String(input.query ?? "")
    .trim()
    .toLowerCase();

  if (!query) {
    throw new Error("Search query is required");
  }

  const results = knowledgeBase.filter((item) =>
    item.keywords.some(
      (keyword) => query.includes(keyword) || keyword.includes(query),
    ),
  );

  return {
    query,

    results,
  };
}
