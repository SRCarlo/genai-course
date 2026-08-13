import { createStructuredCompletion } from "./llmService.js";

export async function createHighLevelPlan(goal) {
  const response = await createStructuredCompletion({
    messages: [
      {
        role: "system",

        content:
          "Create a concise high-level plan for solving the user's goal. " +
          "Do not execute tools. " +
          "Return only the plan steps.",
      },

      {
        role: "user",

        content: goal,
      },
    ],

    responseFormat: {
      type: "json_schema",

      json_schema: {
        name: "agent_plan",

        strict: true,

        schema: {
          type: "object",

          properties: {
            steps: {
              type: "array",

              items: {
                type: "string",
              },
            },
          },

          required: ["steps"],

          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Planner returned empty response");
  }

  return JSON.parse(content);
}
