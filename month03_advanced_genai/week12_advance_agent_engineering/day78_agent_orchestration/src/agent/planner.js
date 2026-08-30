import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-20b";

const plannerTools = {
  getOrder: {
    description: "Get information about a customer order.",
    parameters: ["orderId"],
  },

  searchKnowledgeBase: {
    description: "Search the customer support knowledge base.",
    parameters: ["query"],
  },

  calculate: {
    description: "Perform a mathematical calculation.",
    parameters: ["expression"],
  },

  cancelOrder: {
    description: "Cancel a customer order. Requires human approval.",
    parameters: ["orderId"],
  },
};

export async function createPlan(state) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  state.llmCalls++;

  const toolDescription = JSON.stringify(plannerTools, null, 2);

  const response = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: `
You are the planning component of a production customer-support agent.

Available tools:
${toolDescription}

Create a minimal execution plan.

Rules:

1. Use only the available tools.
2. Never invent a tool.
3. If the user asks to check an order, use getOrder.
4. If the user asks about policy, use searchKnowledgeBase.
5. If the user asks for a calculation, use calculate.
6. If the user asks to cancel an order, use getOrder first if an order ID exists, then cancelOrder.
7. If an order ID is missing for an order-specific request, return a clarification action.
8. Keep the plan minimal.
9. Return ONLY valid JSON.

JSON format:

{
  "type": "plan",
  "steps": [
    {
      "action": "getOrder",
      "arguments": {
        "orderId": "ORD-1001"
      }
    }
  ]
}

For clarification:

{
  "type": "clarification",
  "question": "Which order ID would you like me to check?"
}
`,
      },
      {
        role: "user",
        content: state.query,
      },
    ],

    response_format: {
      type: "json_object",
    },

    temperature: 0,

    max_completion_tokens: 1000,

    include_reasoning: false,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Planner returned an empty response");
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Planner returned invalid JSON");
  }

  if (parsed.type === "clarification") {
    state.status = "waiting_for_user";
    state.clarificationQuestion = parsed.question;

    return [];
  }

  if (parsed.type !== "plan" || !Array.isArray(parsed.steps)) {
    throw new Error("Invalid planner response");
  }

  state.plan = parsed.steps;

  addEvent(state, {
    type: "plan.created",
    steps: state.plan,
  });

  return state.plan;
}

function addEvent(state, event) {
  state.events.push({
    ...event,
    timestamp: new Date().toISOString(),
  });
}
