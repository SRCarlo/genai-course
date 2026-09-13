import { BaseAgent } from "./base.agent.js";

import { analyzeResearch } from "../tools/analysis.tool.js";

export class AnalysisAgent extends BaseAgent {
  constructor() {
    super({
      name: "analysis-agent",

      role: "Analyze research findings",

      tools: ["analysis"],

      permissions: ["analyze"],
    });
  }

  async execute(input) {
    try {
      const raw = await analyzeResearch({
        task: input.task,

        research: input.research,
      });

      let parsed;

      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {
          rawAnalysis: raw,
        };
      }

      return {
        agent: this.name,

        status: "completed",

        confidence: 0.9,

        result: parsed,
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
