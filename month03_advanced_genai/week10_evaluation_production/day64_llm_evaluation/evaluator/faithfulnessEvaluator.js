import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const judgeModel = process.env.GROQ_JUDGE_MODEL || "openai/gpt-oss-20b";

export async function evaluateFaithfulness({ question, answer, context }) {
  if (!answer) {
    return {
      score: 0,
      reason: "No answer was generated.",
    };
  }

  const contextText = Array.isArray(context)
    ? context
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item.text ?? item.content ?? JSON.stringify(item);
        })
        .join("\n\n")
    : String(context || "");

  if (!contextText.trim()) {
    return {
      score: 0,
      reason: "No retrieved context was available.",
    };
  }

  const prompt = `
Evaluate whether the answer is supported by the retrieved context.

Question:
${question}

Retrieved context:
${contextText}

Answer:
${answer}

Return JSON:

{
  "score": 0,
  "reason": ""
}

Score rules:

1 = all important claims are supported by context.

0.75 = mostly supported, with a minor unsupported detail.

0.5 = partially supported.

0.25 = mostly unsupported.

0 = unsupported or contradicted.

Do not judge whether the answer sounds good.
Only judge grounding in the supplied context.
`;

  try {
    const response = await groq.chat.completions.create({
      model: judgeModel,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a strict RAG faithfulness evaluator. Return JSON only.",
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

    const result = JSON.parse(content);

    return {
      score: Math.max(0, Math.min(1, Number(result.score) || 0)),
      reason: result.reason || "",
    };
  } catch (error) {
    return {
      score: 0,
      reason: `Faithfulness judge error: ${error.message}`,
    };
  }
}
