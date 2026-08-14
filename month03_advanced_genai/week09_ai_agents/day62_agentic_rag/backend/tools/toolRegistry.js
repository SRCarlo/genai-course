import { ragSearchTool } from "./ragSearchTool.js";
import { calculatorTool } from "./calculatorTool.js";

export const toolDefinitions = [
  {
    type: "function",

    function: {
      name: "knowledge_search",

      description:
  "Search the private company knowledge base. ONLY use this for company-specific information, internal policies, employee handbook content, or private company documents. Do NOT use this for general programming, science, technology, or other general-knowledge questions.",
      parameters: {
        type: "object",

        properties: {
          query: {
            type: "string",
            description:
              "A clear standalone search query for the company knowledge base.",
          },

          topK: {
            type: "integer",
            description: "Number of relevant chunks to retrieve.",
            default: 5,
          },
        },

        required: ["query"],
      },
    },
  },

  {
    type: "function",

    function: {
      name: "calculator",

      description: "Perform mathematical calculations.",

      parameters: {
        type: "object",

        properties: {
          expression: {
            type: "string",
            description:
              "Mathematical expression to calculate. Example: 50000 * 0.10",
          },
        },

        required: ["expression"],
      },
    },
  },
];

export async function executeTool(toolName, input) {
  switch (toolName) {
    case "knowledge_search":
      return await ragSearchTool(input);

    case "calculator":
      return await calculatorTool(input);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
