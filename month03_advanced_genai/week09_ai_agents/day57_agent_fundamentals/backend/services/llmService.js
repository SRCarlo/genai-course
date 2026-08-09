import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function convertTools(tools = []) {
  return tools.map((tool) => ({
    type: "function",

    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.schema,
    },
  }));
}

export async function callLLM({ messages, tools = [] }) {
  const groqTools = convertTools(tools);

  console.log("\n========== GROQ REQUEST ==========");

  console.log("Model:", MODEL);

  console.log(
    "Tools:",
    groqTools.map((tool) => tool.function.name),
  );

  const response = await groq.chat.completions.create({
    model: MODEL,

    messages,

    tools: groqTools,

    tool_choice: "auto",

    temperature: 0,

    max_tokens: 1024,
  });

  const message = response.choices[0].message;

  console.log("\n========== GROQ RESPONSE ==========");

  console.log("Content:", message.content);

  console.log("Tool calls:", message.tool_calls);

  /*
   * No tool call.
   */
  if (!message.tool_calls || message.tool_calls.length === 0) {
    return {
      type: "final",

      content: message.content || "I could not generate an answer.",
    };
  }

  /*
   * We currently support one tool call
   * at a time.
   */
  const toolCall = message.tool_calls[0];

  let argumentsObject;

  try {
    argumentsObject = JSON.parse(toolCall.function.arguments);
  } catch (error) {
    throw new Error(`Invalid tool arguments: ${toolCall.function.arguments}`);
  }

  return {
    type: "tool_call",

    toolName: toolCall.function.name,

    arguments: argumentsObject,

    toolCallId: toolCall.id,

    assistantMessage: message,
  };
}
