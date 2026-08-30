export function decideNextAction(state) {
  if (state.status !== "running") {
    return {
      type: "stop",
      reason: state.status,
    };
  }

  if (state.currentStep >= state.plan.length) {
    return {
      type: "final",
    };
  }

  const step = state.plan[state.currentStep];

  return {
    type: "tool",
    action: step,
  };
}
