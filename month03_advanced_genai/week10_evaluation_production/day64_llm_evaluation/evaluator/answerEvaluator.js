import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const judgeModel = process.env.GROQ_JUDGE_MODEL || "openai/gpt-oss-20b";

function clamp(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(0, Math.min(1, number));
}

function deterministicScore(expected, actual) {
  if (!expected || !actual) {
    return 0;
  }

  const normalize = (value) =>
    value
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  if (normalize(expected) === normalize(actual)) {
    return 1;
  }

  return null;
}

export async function evaluateAnswer({
  question,
  expectedAnswer,
  actualAnswer,
  context = [],
  useLLMJudge = true,
}) {
  const exactScore = deterministicScore(expectedAnswer, actualAnswer);

  if (exactScore === 1) {
    return {
      question,
      expectedAnswer,
      actualAnswer,
      correctness: 1,
      relevance: 1,
      faithfulness: 1,
      reason: "Exact normalized match.",
      judge: "deterministic",
    };
  }

  if (!useLLMJudge) {
    return {
      question,
      expectedAnswer,
      actualAnswer,
      correctness: exactScore ?? 0,
      relevance: exactScore ?? 0,
      faithfulness: 0,
      reason: "LLM judge disabled.",
      judge: "deterministic",
    };
  }

  const contextText = Array.isArray(context)
    ? context
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return JSON.stringify(item);
        })
        .join("\n\n")
    : String(context || "");

  const prompt = `
You are an evaluator for a production RAG/Agent system.

Evaluate the answer using ONLY the information supplied below.

QUESTION:
${question}

EXPECTED ANSWER:
${expectedAnswer ?? "No specific answer. The system should refuse or state that the information is outside its knowledge base."}

ACTUAL ANSWER:
${actualAnswer ?? ""}

RETRIEVED CONTEXT:
${contextText || "No context provided."}

Return JSON with exactly these fields:

{
  "correctness": number between 0 and 1,
  "relevance": number between 0 and 1,
  "faithfulness": number between 0 and 1,
  "reason": "short explanation"
}

Definitions:

correctness:
Does the actual answer correctly answer the question compared with the expected answer?

relevance:
Does the answer directly address the question without unnecessary unrelated information?

faithfulness:
Is every important factual claim in the answer supported by the retrieved context?

Be conservative.
Do not give a high faithfulness score when the answer contains unsupported claims.
`;

  try {
    const response = await groq.chat.completions.create({
      model: judgeModel,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a strict AI evaluation judge. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices?.[0]?.message?.content;

    const parsed = JSON.parse(content);

    return {
      question,
      expectedAnswer,
      actualAnswer,
      correctness: clamp(parsed.correctness),
      relevance: clamp(parsed.relevance),
      faithfulness: clamp(parsed.faithfulness),
      reason: parsed.reason || "",
      judge: "groq",
    };
  } catch (error) {
    return {
      question,
      expectedAnswer,
      actualAnswer,
      correctness: 0,
      relevance: 0,
      faithfulness: 0,
      reason: `Judge error: ${error.message}`,
      judge: "error",
    };
  }
}
