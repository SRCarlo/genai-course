import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function generateText({ system, user, temperature = 0.2 }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,

    temperature,

    messages: [
      {
        role: "system",
        content: system,
      },

      {
        role: "user",
        content: user,
      },
    ],
  });

  return completion.choices?.[0]?.message?.content ?? "";
}

export async function generateJSON({ system, user }) {
  const content = await generateText({
    system,
    user,
    temperature: 0,
  });

  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Groq returned invalid JSON:\n${content}`);
  }
}

export async function generateFinalAnswer({ goal, observations }) {
  const system = `
You are the final answer generator for an AI planning agent.

Answer the user's goal using only the execution observations provided.

Do not invent tool results.

Be concise but useful.

Return only the final natural-language answer.
`;

  const user = `
USER GOAL:
${goal}

EXECUTION OBSERVATIONS:
${JSON.stringify(observations, null, 2)}
`;

  return generateText({
    system,
    user,
    temperature: 0.2,
  });
}

export async function createPlanWithGroq({ goal, availableTools }) {
  const system = `
You are a task planning agent.

Your job is to break the user's goal into
the smallest reliable executable steps.

Available tools:
${JSON.stringify(availableTools, null, 2)}

Rules:

1. Use only tools from the available tools list.
2. Never invent a tool.
3. Keep the plan minimal.
4. Every step requires an integer id.
5. Every step requires a description.
6. Use a tool only when necessary.
7. Tool input must be valid JSON.
8. Do not include markdown.
9. Return ONLY valid JSON.
10. Maximum 10 steps.

Required format:

{
  "goal": "string",
  "steps": [
    {
      "id": 1,
      "description": "string",
      "tool": null,
      "input": null
    }
  ]
}
`;

  const user = `
Create an executable plan for this goal:

${goal}
`;

  return generateJSON({
    system,
    user,
  });
}

export async function replanWithGroq({
  goal,
  previousPlan,
  observations,
  failedStep,
  availableTools,
}) {
  const system = `
You are a dynamic replanning agent.

The original plan encountered a failure.

Create a new minimal executable plan.

Available tools:
${JSON.stringify(availableTools, null, 2)}

Rules:

1. Use only available tools.
2. Do not repeat a failed strategy unless necessary.
3. Consider the execution observations.
4. Keep the plan minimal.
5. Maximum 10 steps.
6. Return ONLY valid JSON.

Required format:

{
  "goal": "string",
  "steps": [
    {
      "id": 1,
      "description": "string",
      "tool": null,
      "input": null
    }
  ]
}
`;

  const user = `
GOAL:
${goal}

PREVIOUS PLAN:
${JSON.stringify(previousPlan, null, 2)}

OBSERVATIONS:
${JSON.stringify(observations, null, 2)}

FAILED STEP:
${JSON.stringify(failedStep, null, 2)}

Create the new plan.
`;

  return generateJSON({
    system,
    user,
  });
}
