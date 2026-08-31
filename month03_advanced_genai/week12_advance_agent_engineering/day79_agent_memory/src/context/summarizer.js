import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function createSummary(messages) {
  if (!messages.length) {
    return {
      userGoal: null,
      project: {},
      currentTask: null,
      decisions: [],
      openQuestions: [],
      summary: "",
    };
  }

  const conversation = messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  const response = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",

        content: `
You are a conversation memory summarizer.

Summarize the conversation into useful
information that should remain available
after older messages are removed.

Return ONLY valid JSON.

Use this exact structure:

{
  "userGoal": "string or null",
  "project": {
    "name": "string or null",
    "language": "string or null",
    "database": "string or null"
  },
  "currentTask": "string or null",
  "decisions": [],
  "openQuestions": [],
  "summary": "string"
}

Do not invent information.
Do not include secrets.
Do not include unnecessary personal details.
          `,
      },

      {
        role: "user",
        content: conversation,
      },
    ],

    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Summarizer returned empty response");
  }

  try {
    return JSON.parse(content);
  } catch {
    return {
      userGoal: null,
      project: {},
      currentTask: null,
      decisions: [],
      openQuestions: [],
      summary: content,
    };
  }
}
