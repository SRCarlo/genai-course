export const permissions = {
  supervisorAgent: ["delegate", "collect_results", "synthesize"],

  nodeAgent: ["research"],

  springAgent: ["research"],

  fastApiAgent: ["research"],

  analysisAgent: ["analyze"],

  reviewerAgent: ["review"],

  writerAgent: ["write"],

  routerAgent: ["route"],
};

export function hasPermission(agent, action) {
  return permissions[agent]?.includes(action) ?? false;
}

export function assertPermission(agent, action) {
  if (!hasPermission(agent, action)) {
    throw new Error(`PERMISSION_DENIED: ${agent} cannot perform ${action}`);
  }
}
