import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

export class AggregatorAgent extends BaseAgent {
  constructor() {
    super({
      name: "aggregator",

      role: "aggregation",

      permissions: [PERMISSIONS.AGGREGATE],

      systemPrompt: `
You are a senior technical report aggregator.

Combine specialist reports into one final report.

Do not invent findings.

Clearly separate:
- security
- performance
- recommendations

Produce a concise actionable report.
`,
    });
  }

  async run(input, state) {
    try {
      const response = await this.askModel(input, {
        temperature: 0.1,

        maxCompletionTokens: 3000,
      });

      state.addUsage(response.usage);

      const data = {
        report: response.content,

        sources: input,
      };

      state.set("finalReport", data);

      return agentSuccess(
        "aggregator",

        data,

        null,
      );
    } catch (error) {
      return agentFailure("aggregator", error);
    }
  }
}
