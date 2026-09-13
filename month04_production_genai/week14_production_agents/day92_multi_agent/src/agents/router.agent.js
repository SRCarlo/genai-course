import { BaseAgent } from "./base.agent.js";

export class RouterAgent extends BaseAgent {
  constructor() {
    super({
      name: "router-agent",

      role: "Route requests to the appropriate workflow",

      tools: [],

      permissions: ["route"],
    });
  }

  async execute(input) {
    const text = input.task.toLowerCase();

    if (
      text.includes("compare") ||
      text.includes("comparison") ||
      text.includes("technology") ||
      text.includes("framework")
    ) {
      return {
        agent: this.name,

        status: "completed",

        result: {
          route: "research-comparison",
        },
      };
    }

    return {
      agent: this.name,

      status: "completed",

      result: {
        route: "general",
      },
    };
  }
}
