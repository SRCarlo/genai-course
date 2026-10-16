import Groq from "groq-sdk";

const DEFAULT_MODEL = "openai/gpt-oss-20b";

export async function runChatEvaluation({ testCase, client } = {}) {
  if (!testCase || typeof testCase.question !== "string" ||
      typeof testCase.context !== "string") {
    throw new TypeError("runChatEvaluation requires a testCase with question and context");
  }
  if (!client) {
    throw new TypeError("A Groq client must be provided");
  }

  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: [
          "Answer the question using only the supplied context.",
          "If the context does not contain the answer, explicitly say the information is not specified.",
          "Do not infer or invent policies.",
          "Keep the answer concise."
        ].join(" ")
      },
      {
        role: "user",
        content: `Context:\n${testCase.context}\n\nQuestion:\n${testCase.question}`
      }
    ],
    temperature: 0,
    max_completion_tokens: 512,
    reasoning_effort: "low"
  });

  const answer = completion.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || answer.trim() === "") {
    throw new Error(`Groq returned an empty answer for ${testCase.id}`);
  }

  return {
    answer,
    usage: completion.usage ?? null,
    model: process.env.GROQ_MODEL || DEFAULT_MODEL
  };
}

export function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required when EVAL_USE_GROQ=true");
  }
  return new Groq({ apiKey, timeout: 30_000, maxRetries: 2 });
}
