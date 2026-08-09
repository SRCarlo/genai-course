import { tools, getTool } from "./agent.js";
import { callLLM } from "../services/llmService.js";

export async function runAgent(userMessage) {
  const messages = [
    {
      role: "system",
      content: `
You are a helpful AI agent.

Use tools when necessary.

After receiving a tool result, decide whether
you need another tool or can provide the final answer.

Always provide the final answer as normal natural language text.
Do not return the final answer as an object.
      `.trim(),
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  for (let step = 0; step < 5; step++) {
    console.log(`\n========== AGENT STEP ${step + 1} ==========`);

    const response = await callLLM({
      messages,
      tools,
    });

    console.log("Agent response:", response);

    // Final answer
    if (response.type === "final") {
      return String(response.content);
    }

    // Tool call
    if (response.type === "tool_call") {
      const tool = getTool(response.toolName);

      if (!tool) {
        throw new Error(`Unknown tool: ${response.toolName}`);
      }

      console.log("\n========== TOOL CALL ==========");
      console.log("Tool:", response.toolName);
      console.log("Arguments:", response.arguments);

      const result = await tool.execute(response.arguments);

      console.log("\n========== TOOL RESULT ==========");
      console.log(result);

      messages.push({
        role: "assistant",
        content: response.rawContent || "",
      });

      messages.push({
        role: "tool",
        content: JSON.stringify(result),
      });

      continue;
    }

    throw new Error("Unknown agent response type");
  }

  throw new Error("Agent exceeded maximum steps");
}
