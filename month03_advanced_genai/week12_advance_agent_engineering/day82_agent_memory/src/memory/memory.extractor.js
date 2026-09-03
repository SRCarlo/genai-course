import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

export async function extractMemories({ userMessage, assistantResponse }) {
  const completion = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: `
You extract useful long-term memories from a user interaction.

Only extract information that is likely to remain useful
in future conversations.

Good memories:
- user preferences
- user goals
- stable facts
- important project information
- meaningful events

Do NOT extract:
- passwords
- API keys
- access tokens
- secrets
- payment information
- temporary small talk
- information about other people

Return only memories that are genuinely useful.

If there are no useful memories, return an empty array.
        `.trim(),
      },

      {
        role: "user",
        content: JSON.stringify({
          userMessage,
          assistantResponse,
        }),
      },
    ],

    response_format: {
      type: "json_schema",

      json_schema: {
        name: "memory_extraction",

        strict: true,

        schema: {
          type: "object",

          properties: {
            memories: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  type: {
                    type: "string",
                    enum: ["fact", "preference", "goal", "event"],
                  },

                  content: {
                    type: "string",
                  },

                  importance: {
                    type: "number",
                  },
                },

                required: ["type", "content", "importance"],

                additionalProperties: false,
              },
            },
          },

          required: ["memories"],

          additionalProperties: false,
        },
      },
    },

    reasoning_effort: "low",

    include_reasoning: false,

    stream: false,
  });

  const content = completion.choices[0]?.message?.content || "{}";

  return JSON.parse(content);
}
