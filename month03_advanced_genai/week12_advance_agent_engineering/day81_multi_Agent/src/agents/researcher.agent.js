import { BaseAgent } from "./base.agent.js";

import { agentSuccess, agentFailure } from "../orchestration/result.js";

import { PERMISSIONS } from "../orchestration/permissions.js";

export class ResearcherAgent extends BaseAgent {
  constructor() {
    super({
      name: "researcher",

      role: "research",

      permissions: [PERMISSIONS.RESEARCH],

      systemPrompt: `
You are a senior technical researcher.

Research the requested technical topic.

Focus on:
- architecture
- APIs
- implementation requirements
- security
- performance
- reliability
- practical Node.js considerations

Do not implement production code.

Provide useful information to a coding agent.
`,
    });
  }

  async run(input, state) {
    try {
      const response = await this.askModel(input, {
        temperature: 0.2,

        maxCompletionTokens: 2500,
      });

      state.addUsage(response.usage);

      const data = {
        topic: typeof input === "string" ? input : JSON.stringify(input),

        findings: [response.content],
      };

      state.set("research", data);

      return agentSuccess(
        "researcher",

        data,

        "coder",
      );
    } catch (error) {
      return agentFailure("researcher", error);
    }
  }
}
