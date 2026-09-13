import { SupervisorAgent } from "../src/agents/supervisor.agent.js";

describe("Supervisor Agent", () => {
  test("supervisor coordinates agents", async () => {
    const createMockAgent = (name, result) => ({
      name,

      async execute() {
        return {
          agent: name,

          status: "completed",

          confidence: 0.9,

          result,
        };
      },
    });

    const nodeAgent = createMockAgent("node-agent", {
      technology: "Node.js",
    });

    const springAgent = createMockAgent("spring-agent", {
      technology: "Spring Boot",
    });

    const fastApiAgent = createMockAgent("fastapi-agent", {
      technology: "FastAPI",
    });

    const analysisAgent = createMockAgent("analysis-agent", {
      recommendation: "Node.js",
    });

    const reviewerAgent = createMockAgent("reviewer-agent", {
      approved: true,
    });

    const writerAgent = createMockAgent("writer-agent", {
      draft: "Final answer",
    });

    const supervisor = new SupervisorAgent({
      nodeAgent,
      springAgent,
      fastApiAgent,
      analysisAgent,
      reviewerAgent,
      writerAgent,
    });

    const state = {
      workflowId: "test-workflow",

      task: "Compare technologies",

      research: {
        node: null,
        spring: null,
        fastapi: null,
      },

      analysis: null,

      review: null,

      finalAnswer: null,

      status: "created",

      trace: [],
    };

    const result = await supervisor.execute(
      "Compare Node.js, Spring Boot and FastAPI",
      state,
    );

    expect(result.status).toBe("completed");

    expect(result.finalAnswer).not.toBeNull();
  });
});
