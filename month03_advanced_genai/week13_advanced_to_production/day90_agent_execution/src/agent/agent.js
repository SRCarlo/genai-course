import { createAgentState } from "./agent.state.js";

import { runAgent } from "./agent.loop.js";

export async function createAndRunAgent(goal) {
  const state = createAgentState(goal);

  return runAgent(state);
}
