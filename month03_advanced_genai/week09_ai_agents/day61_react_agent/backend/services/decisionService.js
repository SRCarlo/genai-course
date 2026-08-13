import { askLLM } from "./llmService.js";

import { getAvailableTools } from "../tools/toolRegistry.js";

function validateAction(action) {
  if (!action || typeof action !== "object") {
    throw new Error("LLM returned an invalid action");
  }

  if (action.type !== "tool" && action.type !== "final") {
    throw new Error(`Invalid action type: ${action.type}`);
  }

  // --------------------------------
  // Final answer
  // --------------------------------

  if (action.type === "final") {
    if (typeof action.answer !== "string" || !action.answer.trim()) {
      throw new Error("Final action requires an answer");
    }

    return {
      type: "final",
      answer: action.answer,
    };
  }

  // --------------------------------
  // Tool action
  // --------------------------------

  if (typeof action.tool !== "string") {
    throw new Error("Tool action requires a tool name");
  }

  const availableTools = getAvailableTools();

  if (!availableTools.includes(action.tool)) {
    throw new Error(`Tool not allowed: ${action.tool}`);
  }

  if (!action.input || typeof action.input !== "object") {
    throw new Error("Tool action requires input");
  }

  return {
    type: "tool",
    tool: action.tool,
    input: action.input,
  };
}

export async function decideNextAction(state) {
  const availableTools = getAvailableTools();

  const systemPrompt = `
You are a ReAct AI agent.

Your job is to solve the user's goal by
choosing ONE next action at a time.

Available tools:

${availableTools.map((tool) => `- ${tool}`).join("\n")}

You have two possible action types.

TOOL ACTION:

{
  "type": "tool",
  "tool": "calculator",
  "input": {
    "expression": "25 * 40"
  }
}

SEARCH TOOL:

{
  "type": "tool",
  "tool": "search",
  "input": {
    "query": "current population of India"
  }
}

FINAL ACTION:

{
  "type": "final",
  "answer": "The final answer..."
}

Rules:

1. Return ONLY valid JSON.
2. Return exactly ONE action.
3. Do not return markdown.
4. Do not return explanations outside JSON.
5. Only use available tools.
6. Use previous observations to decide the next action.
7. Do not assume tool results that have not been observed.
8. If more information is required, use a tool.
9. If the goal has been solved, return a final answer.
10. Do not create a complete plan.
11. Decide only the NEXT action.
`;

  const userPrompt = `
USER GOAL:
${state.goal}

CURRENT ITERATION:
${state.iteration}

TOOL CALLS USED:
${state.toolCalls}

PREVIOUS HISTORY:
${JSON.stringify(state.history, null, 2)}

PREVIOUS OBSERVATIONS:
${JSON.stringify(state.observations, null, 2)}

AVAILABLE TOOLS:
${availableTools.join(", ")}

Now choose exactly ONE next action.
Return JSON only.
`;

  try {
    const rawResponse = await askLLM({
      systemPrompt,
      userPrompt,
    });

    let action;

    try {
      action = JSON.parse(rawResponse);
    } catch (error) {
      throw new Error(`LLM returned invalid JSON: ${rawResponse}`);
    }

    return validateAction(action);
  } catch (error) {
    throw new Error(`Groq decision failed: ${error.message}`);
  }
}
