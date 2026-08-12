import { getTool } from "../tools/toolRegistry.js";

function resolveReferences(input, state) {
  if (!input || typeof input !== "object") {
    return input;
  }

  const resolved = {
    ...input,
  };

  if (Number.isInteger(input.fromStep)) {
    const previousStep = state.plan.find((step) => step.id === input.fromStep);

    if (!previousStep) {
      throw new Error(`Referenced step ${input.fromStep} does not exist`);
    }

    if (previousStep.result === null || previousStep.result === undefined) {
      throw new Error(`Result from step ${input.fromStep} is unavailable`);
    }

    resolved.a = previousStep.result;
  }

  if (Number.isInteger(input.countFromStep)) {
    const previousStep = state.plan.find(
      (step) => step.id === input.countFromStep,
    );

    if (!previousStep) {
      throw new Error(`Referenced step ${input.countFromStep} does not exist`);
    }

    if (Array.isArray(previousStep.input?.values)) {
      resolved.b = previousStep.input.values.length;
    }
  }

  delete resolved.fromStep;

  delete resolved.countFromStep;

  return resolved;
}

export async function executeStep(step, state) {
  step.status = "running";

  state.currentStep = step.id;

  state.stepCount += 1;

  console.log(`[STEP ${step.id}] ${step.description}`);

  try {
    if (!step.tool) {
      let result;

      if (step.input && Array.isArray(step.input.values)) {
        result = step.input.values.length;
      } else {
        result = {
          message: step.description,
        };
      }

      step.result = result;

      step.status = "completed";

      return {
        success: true,

        result,
      };
    }

    const tool = getTool(step.tool);

    if (!tool) {
      throw new Error(`Unknown tool: ${step.tool}`);
    }

    if (state.totalToolCalls >= state.maxToolCalls) {
      throw new Error("Maximum tool calls exceeded");
    }

    state.totalToolCalls += 1;

    const input = resolveReferences(step.input, state);

    console.log(`[TOOL ${step.tool}]`, input);

    const result = await tool(input, {
      state,
      step,
    });

    step.result = result;

    step.status = "completed";

    console.log(`[RESULT]`, result);

    return {
      success: true,

      result,
    };
  } catch (error) {
    step.status = "failed";

    step.error = error.message;

    console.error(`[ERROR STEP ${step.id}]`, error.message);

    return {
      success: false,

      error: error.message,
    };
  }
}
