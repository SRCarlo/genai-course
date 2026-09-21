import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

if (!process.env.GROQ_API_KEY) {
  console.warn(
    "GROQ_API_KEY is not set. LLM calls will fail until .env is configured.",
  );
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: Number(process.env.LLM_TIMEOUT_MS || 60000),
});

export async function generateAnswer({ question, context }) {
  const system = [
    "You are a production RAG assistant.",
    "Answer only from the supplied context.",
    "If the context does not contain enough information, say that the knowledge base does not contain enough information.",
    "Do not invent facts.",
    "Keep the answer concise and directly address the question.",
  ].join(" ");

  const prompt = [`Question: ${question}`, "", "Context:", context].join("\n");

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    max_completion_tokens: 800,
    include_reasoning: false,
  });

  const message = response.choices?.[0]?.message;
  const content = message?.content?.trim() || "";

  return {
    answer: content,
    usage: {
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
    model: response.model || MODEL,
  };
}

export async function judgeAnswer({ question, context, answer }) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: [
          "You are an evaluation judge for a RAG system.",
          "Evaluate only the supplied question, context and answer.",
          "Return JSON only.",
          'Schema: {"faithful":boolean,"faithfulness":number,"answerRelevance":number,"unsupportedClaims":string[]}',
          "Scores must be between 0 and 1.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({ question, context, answer }),
      },
    ],
    temperature: 0,
    max_completion_tokens: 500,
    include_reasoning: false,
    response_format: { type: "json_object" },
  });

  const raw = response.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      faithful: false,
      faithfulness: 0,
      answerRelevance: 0,
      unsupportedClaims: ["Judge returned invalid JSON."],
    };
  }

  return {
    ...parsed,
    usage: {
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
    },
  };
}
