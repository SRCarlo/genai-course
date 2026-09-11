import "dotenv/config";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is missing. Add it to your .env file.");
}

export const groq = new Groq({
  apiKey,
});

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export async function generateAgentPlan({ goal, state }) {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,

    temperature: 0,

    messages: [
      {
        role: "system",
        content: `
You are the planning component of a secure AI agent runtime.

Your job is ONLY to create a safe execution plan.

Available tools:
- getOrder
- checkRefundEligibility
- refundOrder

Rules:
1. Never invent tools.
2. Never invent arguments.
3. refundOrder must only appear after checkRefundEligibility.
4. If refund eligibility is false, refundOrder must be skipped.
5. Return ONLY valid JSON.
6. Do not execute tools.
7. Do not bypass authorization or human approval.
8. Use the observations from previous steps.
`,
      },

      {
        role: "user",
        content: JSON.stringify({
          goal,
          state: {
            status: state.status,
            plan: state.plan,
            currentStep: state.currentStep,
            observations: state.observations,
            errors: state.errors,
            iteration: state.iteration,
          },
        }),
      },
    ],

    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("EMPTY_GROQ_RESPONSE");
  }

  return JSON.parse(content);
}
