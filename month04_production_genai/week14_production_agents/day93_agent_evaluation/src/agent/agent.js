import Groq from "groq-sdk";
import { GROQ_MODEL } from "../config/model.js";
import { toolDefinitions, tools } from "./tools.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are the Day 93 demo production agent.
Answer the user's request accurately and concisely.
Use tools only when they are appropriate.
Never expose private data or perform unauthorized actions.
If the request asks for something you cannot safely provide, refuse briefly.
`;

function parseToolArguments(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}

export async function executeAgent(input, context = "") {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(context ? [{ role: "system", content: `Evidence:\n${context}` }] : []),
    { role: "user", content: input }
  ];

  const toolCalls = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (let step = 0; step < 5; step++) {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      tools: toolDefinitions(),
      tool_choice: "auto",
      temperature: 0.2,
      include_reasoning: false
    });

    const choice = response.choices?.[0];
    const message = choice?.message;

    totalInputTokens += response.usage?.prompt_tokens || 0;
    totalOutputTokens += response.usage?.completion_tokens || 0;

    if (!message) {
      throw new Error("Groq returned no assistant message.");
    }

    messages.push(message);

    if (!message.tool_calls?.length) {
      return {
        output: message.content || "",
        toolCalls,
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          totalTokens: totalInputTokens + totalOutputTokens
        }
      };
    }

    for (const call of message.tool_calls) {
      const name = call.function?.name;
      const args = parseToolArguments(call.function?.arguments);

      toolCalls.push({ name, arguments: args });

      if (!tools[name]) {
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({ error: "Unauthorized or unknown tool" })
        });
        continue;
      }

      const result = await tools[name](args);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result)
      });
    }
  }

  throw new Error("Agent exceeded the maximum number of tool steps.");
}
