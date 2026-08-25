import Groq from "groq-sdk";

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const SYSTEM_PROMPT = `
You are a helpful production AI assistant.

Answer the user's question accurately and directly.

Do not invent facts.

If context is provided, only make claims supported
by the context.

Keep answers concise unless more detail is necessary.
`;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing. " +
        "Add GROQ_API_KEY to your .env file before " +
        "running an AI evaluation.",
    );
  }

  return new Groq({
    apiKey,
  });
}

export async function generateAnswer({ question, context = null }) {
  const groq = getGroqClient();

  const userContent = context
    ? `
Context:
${context}

Question:
${question}
`
    : question;

  const startedAt = Date.now();

  const completion = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],

    temperature: 0.2,

    max_completion_tokens: 512,

    include_reasoning: false,
  });

  const latencyMs = Date.now() - startedAt;

  const message = completion.choices?.[0]?.message;

  return {
    answer: message?.content?.trim() || "",

    latencyMs,

    usage: completion.usage || null,

    model: MODEL,
  };
}

export async function judgeAnswer({
  question,
  expectedAnswer,
  actualAnswer,
  context = null,
}) {
  const groq = getGroqClient();

  const contextSection = context
    ? `
Context:
${context}
`
    : "";

  const prompt = `
You are an AI evaluation judge.

Evaluate the AI answer.

Question:
${question}

Expected answer:
${expectedAnswer}

Actual answer:
${actualAnswer}

${contextSection}

Evaluate these dimensions:

1. correctness
2. relevance
3. faithfulness

Scores must be between 0 and 1.

Correctness:
Is the answer factually correct?

Relevance:
Does the answer directly address the question?

Faithfulness:
If context is provided, are the claims supported by that context?
If no context is provided, use 1.0 when the answer is appropriately supported
by the expected answer and does not introduce unsupported claims.

Return ONLY valid JSON.

Required format:

{
  "correctness": 0,
  "relevance": 0,
  "faithfulness": 0,
  "reason": "short explanation"
}
`;

  const completion = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: "You are a strict and objective AI evaluator.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0,

    max_completion_tokens: 512,

    response_format: {
      type: "json_object",
    },

    include_reasoning: false,
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Judge returned an empty response");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Judge returned invalid JSON: ${content}`);
  }
}
