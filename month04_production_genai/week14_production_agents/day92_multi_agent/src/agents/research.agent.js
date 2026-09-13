import { BaseAgent } from "./base.agent.js";

import { researchTopic } from "../tools/research.tool.js";

export class ResearchAgent extends BaseAgent {
  constructor({ name, technology }) {
    super({
      name,

      role: `Research ${technology}`,

      tools: ["research"],

      permissions: ["research"],
    });

    this.technology = technology;
  }

  async execute(input) {
    try {
      const raw = await researchTopic({
        topic: this.technology,

        focus: input.task,
      });

      let parsed;

      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {
          technology: this.technology,

          summary: raw,
        };
      }

      return {
        agent: this.name,

        status: "completed",

        confidence: 0.85,

        result: parsed,

        sources: [`Groq research for ${this.technology}`],
      };
    } catch (error) {
      return {
        agent: this.name,

        status: "failed",

        confidence: 0,

        result: null,

        error: error.message,
      };
    }
  }
}
