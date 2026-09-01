export class AgentExecutor {
  constructor(agents, logger) {
    this.agents = agents;
    this.logger = logger;
  }

  async execute(agentName, input, state) {
    const agent = this.agents[agentName];

    if (!agent) {
      throw new Error(
        `Unknown agent: ${agentName}`
      );
    }

    const start = Date.now();

    this.logger.info(
      `[${agentName.toUpperCase()}] started`
    );

    try {
      const result = await agent.run(
        input,
        state
      );

      const durationMs = Date.now() - start;

      this.logger.info(
        `[${agentName.toUpperCase()}] completed`
      );

      state.addTrace({
        agent: agentName,
        status: "success",
        durationMs,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - start;

      this.logger.error(
        `[${agentName.toUpperCase()}] failed: ${error.message}`
      );

      state.addTrace({
        agent: agentName,
        status: "error",
        durationMs,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }
}
