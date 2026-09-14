import Groq from "groq-sdk";
import { GROQ_MODEL } from "../config/model.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const JudgeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctness: { type: "integer", minimum: 1, maximum: 5 },
    relevance: { type: "integer", minimum: 1, maximum: 5 },
    completeness: { type: "integer", minimum: 1, maximum: 5 },
    groundedness: { type: "integer", minimum: 1, maximum: 5 },
    overall: { type: "number", minimum: 1, maximum: 5 },
    reason: { type: "string" }
  },
  required: [
    "correctness",
    "relevance",
    "completeness",
    "groundedness",
    "overall",
    "reason"
  ]
};

export async function judgeAnswer({ input, expected, output, context }) {
  const prompt = `
Evaluate this AI agent response.

User input:
${input}

Expected requirements:
${JSON.stringify(expected, null, 2)}

Available evidence:
${context || "(none)"}

Agent output:
${output}

Score:
1. correctness
2. relevance
3. completeness
4. groundedness

Use 1-5 integer scores for the first four fields and 1-5 for overall.
Groundedness should be based only on the supplied evidence when evidence is provided.
Return JSON only.
`;

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a strict evaluator of AI agent outputs."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0,
    include_reasoning: false,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "agent_evaluation",
        strict: true,
        schema: JudgeSchema
      }
    }
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("Judge returned no content.");

  return JSON.parse(content);
}
