export function createPlanningState(goal, options = {}) {
  return {
    sessionId: options.sessionId ?? `session-${Date.now()}`,

    goal,

    plan: [],

    currentStep: null,

    completedSteps: [],

    failedSteps: [],

    observations: [],

    status: "planning",

    result: null,

    error: null,

    stepCount: 0,

    totalToolCalls: 0,

    maxSteps: options.maxSteps ?? 10,

    maxRetries: options.maxRetries ?? 2,

    maxToolCalls: options.maxToolCalls ?? 20,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };
}

export function addObservation(state, observation) {
  state.observations.push({
    timestamp: new Date().toISOString(),

    ...observation,
  });

  state.updatedAt = new Date().toISOString();
}

export function updateState(state, updates) {
  Object.assign(state, updates);

  state.updatedAt = new Date().toISOString();

  return state;
}
