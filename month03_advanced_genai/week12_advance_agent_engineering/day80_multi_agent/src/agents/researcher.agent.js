import { BaseAgent } from "./base.agent.js";
import { researchTopic } from "../tools/research.tool.js";

export class ResearcherAgent extends BaseAgent {
  constructor() {
    super("researcher", "Research and information gathering");
  }

  async run(input, state) {
    const result = await researchTopic(input);

    state.set("research", result);

    return result;
  }
}
