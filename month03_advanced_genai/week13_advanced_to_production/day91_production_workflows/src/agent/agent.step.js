export async function agentDecisionStep(state, dependencies) {
  const order = state.observations.find((item) => item.type === "order")?.data;

  if (!order) {
    throw new Error("ORDER_OBSERVATION_MISSING");
  }

  const decision = await dependencies.agent.decide({
    goal: state.goal,
    order,
    policy: dependencies.policy,
  });

  state.agentDecision = decision;

  state.observations.push({
    type: "agent-decision",
    data: decision,
    at: new Date().toISOString(),
  });

  // IMPORTANT:
  // Return only the agent decision.
  // Do NOT return the complete workflow state,
  // otherwise step.result creates a circular reference.
  return decision;
}
