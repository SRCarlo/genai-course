import { RouterAgent } from "../src/agents/router.agent.js";

describe("Router Agent", () => {
  test("routes comparison task correctly", async () => {
    const router = new RouterAgent();

    const result = await router.execute({
      task: "Compare Node.js and Spring Boot",
    });

    expect(result.result.route).toBe("research-comparison");
  });

  test("routes general task correctly", async () => {
    const router = new RouterAgent();

    const result = await router.execute({
      task: "Tell me a joke",
    });

    expect(result.result.route).toBe("general");
  });
});
