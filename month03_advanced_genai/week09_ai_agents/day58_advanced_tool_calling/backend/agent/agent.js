import { getToolSchemas } from "../tools/toolRegistry.js";

import { executeToolCall } from "./toolExecutor.js";

import { callLLM } from "../services/llmService.js";

const MAX_AGENT_STEPS = 5;

const MAX_TOOL_CALLS_PER_STEP = 5;

const SYSTEM_PROMPT = `
You are a helpful AI agent.

You have access to tools.

Use tools when they are genuinely useful.

Available tools include:
- calculator for arithmetic
- getCurrentTime for current server time
- searchKnowledge for technical knowledge

Never invent tool results.

If a tool fails, inspect the error and decide
whether you can continue or provide a useful answer.

After receiving tool results, provide a concise
and accurate final response.
`;

export async function runAgent(userMessage) {
  const tools = getToolSchemas();

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },

    {
      role: "user",
      content: userMessage,
    },
  ];

  const trace = [];

  for (let step = 1; step <= MAX_AGENT_STEPS; step++) {
    const response = await callLLM({
      messages,
      tools,
    });

    if (response.type === "final") {
      trace.push({
        step,
        type: "final",
      });

      return {
        answer: response.content,
        trace,
      };
    }

    const toolCalls = response.toolCalls || [];

    if (toolCalls.length > MAX_TOOL_CALLS_PER_STEP) {
      throw new Error("Too many tool calls in one step");
    }

    messages.push(response.assistantMessage);

    /*
     * Execute all tool calls.
     *
     * We use Promise.all because the calls
     * in the same LLM response are treated
     * as independent for this exercise.
     */
    const results = await Promise.all(
      toolCalls.map(async (toolCall) => {
        let parsedArguments;

        try {
          parsedArguments = JSON.parse(toolCall.arguments || "{}");
        } catch {
          return {
            success: false,

            tool: toolCall.name,

            error: "Invalid JSON tool arguments",
          };
        }

        const startedAt = Date.now();

        const result = await executeToolCall(toolCall.name, parsedArguments);

        const duration = Date.now() - startedAt;

        trace.push({
          step,

          type: "tool_call",

          tool: toolCall.name,

          arguments: parsedArguments,

          success: result.success,

          durationMs: duration,

          result: result.success ? result.result : undefined,

          error: result.success ? undefined : result.error,
        });

        return {
          toolCall,
          result,
        };
      }),
    );

    /*
     * Send every tool result back to Groq.
     */
    for (const item of results) {
      messages.push({
        role: "tool",

        tool_call_id: item.toolCall.id,

        name: item.toolCall.name,

        content: JSON.stringify(item.result),
      });
    }
  }

  throw new Error("Maximum agent steps exceeded");
}
