import Groq from "groq-sdk";
import { getToolDefinitions } from "../tools/tool.registry.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const SYSTEM_PROMPT = `
You are a production customer-support agent.

Your job is to solve the user's request using the available tools.

Available capabilities:

1. searchKnowledgeBase
   Use this for company policies and documentation.

2. getOrder
   Use this when order information is required.

3. calculator
   Use this for arithmetic calculations.

Rules:

- Do not invent company policies.
- Use searchKnowledgeBase for policy questions.
- Use getOrder when an order ID is provided or required.
- Use calculator for calculations.
- If required information is missing, ask the user for clarification.
- Do not claim that a tool succeeded if it failed.
- Do not expose private chain-of-thought.
- Provide a concise final answer.
- When using knowledge-base information, mention the relevant source title when useful.
`;

export async function createAgentCompletion(messages) {
  const response = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ],

    tools: getToolDefinitions(),

    tool_choice: "auto",

    temperature: 0.2,

    max_completion_tokens: 2048,

    reasoning_effort: "medium",
  });

  return response;
}
