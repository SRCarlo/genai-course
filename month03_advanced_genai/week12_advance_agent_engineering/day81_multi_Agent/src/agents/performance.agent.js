import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

export class PerformanceAgent extends BaseAgent {
  constructor() {
    super({
      name: "performance",

      role: "performance-review",

      permissions: [PERMISSIONS.PERFORMANCE_REVIEW],

      systemPrompt: `
You are a senior performance engineer.

Analyze the supplied API or implementation.

Look for:
- unnecessary database calls
- inefficient algorithms
- memory usage
- latency
- caching opportunities
- concurrency issues
- scalability problems

Return a concise performance report.
`,
    });
  }

  async run(input, state) {
    try {
      const response = await this.askModel(input, {
        temperature: 0.1,

        maxCompletionTokens: 2500,
      });

      state.addUsage(response.usage);

      const data = {
        perspective: "performance",

        report: response.content,
      };

      state.set("performanceReview", data);

      return agentSuccess("performance", data, null);
    } catch (error) {
      return agentFailure("performance", error);
    }
  }
}
