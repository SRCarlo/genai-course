import { getAgentDecision } from "./planner.js";
import { toolRegistry } from "../tools/toolRegistry.js";

export async function runReactLoop(state) {
  while (state.iteration < state.maxIterations) {
    state.iteration++;

    const decision = await getAgentDecision(state);

    /*
     * ================================
     * FINAL ANSWER
     * ================================
     */

    if (decision.type === "final") {
      state.finalAnswer = decision.answer;

      state.status = "completed";

      state.trace.push({
        iteration: state.iteration,

        decision: "final",
      });

      break;
    }

    /*
     * ================================
     * TOOL CALL
     * ================================
     */

    if (decision.type === "tool") {
      state.toolCalls++;

      if (state.toolCalls > state.maxToolCalls) {
        throw new Error("Maximum tool calls reached");
      }

      const toolName = decision.tool;

      const toolInput = decision.input;

      /*
       * ================================
       * RAG LIMIT
       * ================================
       */

      if (toolName === "knowledge_search") {
        if (state.ragCalls >= state.maxRagCalls) {
          throw new Error("Maximum RAG calls reached");
        }

        state.ragCalls++;
      }

      /*
       * ================================
       * FIND TOOL
       * ================================
       */

      const tool = toolRegistry[toolName];

      if (!tool) {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      /*
       * ================================
       * TRACE
       * ================================
       */

      state.trace.push({
        iteration: state.iteration,

        decision: toolName,

        input: toolInput,
      });

      /*
       * ================================
       * EXECUTE TOOL
       * ================================
       */

      const observation = await tool(toolInput);

      /*
       * ================================
       * SAVE OBSERVATION
       * ================================
       */

      state.observations.push({
        tool: toolName,

        input: toolInput,

        result: observation,
      });

      /*
       * ================================
       * ADD ASSISTANT TOOL-CALL MESSAGE
       * ================================
       *
       * IMPORTANT:
       *
       * user
       * ↓
       * assistant tool_call
       * ↓
       * tool result
       *
       */

      state.history.push({
        role: "assistant",

        content: decision.assistantMessage.content ?? null,

        tool_calls: decision.assistantMessage.tool_calls,
      });

      /*
       * ================================
       * ADD TOOL RESULT
       * ================================
       */

      state.history.push({
        role: "tool",

        tool_call_id: decision.toolCallId,

        name: toolName,

        content: JSON.stringify(observation),
      });

      /*
       * ================================
       * SOURCE TRACKING
       * ================================
       */

      if (toolName === "knowledge_search" && observation?.results) {
        for (const result of observation.results) {
          state.sources.push({
            source: result.source,

            chunkId: result.chunkId,

            score: result.score,
          });
        }
      }

      continue;
    }

    throw new Error("Invalid agent decision");
  }

  /*
   * ================================
   * MAX ITERATIONS
   * ================================
   */

  if (state.status === "running" && !state.finalAnswer) {
    state.status = "max_iterations";

    throw new Error("Maximum agent iterations reached");
  }

  return state;
}
