import { createReactState } from "./reactState.js";

import { executeAction } from "./reactLoop.js";

export async function runReactAgent(goal, decideNextAction) {
  const state = createReactState(goal);

  while (state.status === "running" && state.iteration < state.maxIterations) {
    state.iteration++;

    // =================================
    // DECIDE
    // =================================

    let action;

    try {
      action = await decideNextAction(state);
    } catch (error) {
      state.errors.push({
        iteration: state.iteration,
        type: "decision_error",
        error: error.message,
      });

      state.trace.push({
        iteration: state.iteration,
        type: "decision",
        status: "failed",
        error: error.message,
      });

      state.status = "decision_error";

      break;
    }

    // =================================
    // FINAL
    // =================================

    if (action.type === "final") {
      state.finalAnswer = action.answer;

      state.trace.push({
        iteration: state.iteration,
        type: "final",
        status: "completed",
      });

      state.status = "completed";

      break;
    }

    // =================================
    // TOOL CALL LIMIT
    // =================================

    if (state.toolCalls >= state.maxToolCalls) {
      state.trace.push({
        iteration: state.iteration,
        type: "tool_limit",
        status: "stopped",
      });

      state.status = "max_tool_calls_reached";

      break;
    }

    // =================================
    // SAVE CURRENT ACTION
    // =================================

    state.currentAction = action;

    state.toolCalls++;

    // =================================
    // TRACE
    // =================================

    const traceEntry = {
      iteration: state.iteration,

      action: {
        type: action.type,
        tool: action.tool,
        input: action.input,
      },

      status: "started",
    };

    state.trace.push(traceEntry);

    // =================================
    // EXECUTE TOOL
    // =================================

    try {
      const observation = await executeAction(action);

      // Save observation
      state.observations.push(observation);

      // Save history
      state.history.push({
        iteration: state.iteration,

        action,

        observation,

        status: "completed",
      });

      // Update trace
      traceEntry.status = "completed";
    } catch (error) {
      // =================================
      // TOOL ERROR
      // =================================

      const errorObservation = {
        type: "tool_error",

        tool: action.tool,

        error: error.message,
      };

      state.observations.push(errorObservation);

      state.history.push({
        iteration: state.iteration,

        action,

        error: error.message,

        status: "failed",
      });

      state.errors.push({
        iteration: state.iteration,

        type: "tool_error",

        tool: action.tool,

        error: error.message,
      });

      traceEntry.status = "failed";

      traceEntry.error = error.message;
    }
  }

  // =================================
  // MAX ITERATIONS
  // =================================

  if (state.status === "running" && state.iteration >= state.maxIterations) {
    state.status = "max_iterations_reached";
  }

  return state;
}
