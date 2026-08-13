export function createReactState(goal) {
  return {
    goal,

    history: [],

    observations: [],

    currentAction: null,

    iteration: 0,

    toolCalls: 0,

    maxIterations: 10,

    maxToolCalls: 8,

    status: "running",

    finalAnswer: null,

    errors: [],

    trace: [],
  };
}
