export const calculatorSchema = {
  type: "function",

  function: {
    name: "calculator",

    description:
      "Calculate a basic mathematical expression containing numbers and arithmetic operators.",

    parameters: {
      type: "object",

      properties: {
        expression: {
          type: "string",

          description:
            "A mathematical expression such as 125 * 48 or (25 + 5) / 2.",
        },
      },

      required: ["expression"],

      additionalProperties: false,
    },
  },
};

export const timeSchema = {
  type: "function",

  function: {
    name: "getCurrentTime",

    description: "Get the current server date and time.",

    parameters: {
      type: "object",

      properties: {},

      required: [],

      additionalProperties: false,
    },
  },
};

export const knowledgeSchema = {
  type: "function",

  function: {
    name: "searchKnowledge",

    description:
      "Search the application's technical knowledge base for programming and AI engineering information.",

    parameters: {
      type: "object",

      properties: {
        query: {
          type: "string",

          description: "The technical question or search query.",
        },
      },

      required: ["query"],

      additionalProperties: false,
    },
  },
};
