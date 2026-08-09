export const knowledgeTool = {
  name: "searchKnowledge",

  description:
    "Search the technical knowledge base for programming and AI information.",

  schema: {
    type: "object",

    properties: {
      query: {
        type: "string",
        description: "The technical question to search for.",
      },
    },

    required: ["query"],
  },

  async execute({ query }) {
    console.log("Knowledge search:", query);

    return {
      query,
      results: [],
    };
  },
};
