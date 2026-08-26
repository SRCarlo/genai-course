import {
  evaluateExperimentResult,
  summarizeExperiment,
} from "../src/services/optimization.service.js";

describe("Optimization", () => {
  test("should score an exact match as 1", () => {
    const result = evaluateExperimentResult({
      output: "Express.js is a web framework for Node.js.",
      expected: "Express.js is a web framework for Node.js.",
      latencyMs: 100,
      costPerRequest: 0.001,
    });

    expect(result.score).toBe(1);
  });

  test("should summarize experiment", () => {
    const summary = summarizeExperiment([
      {
        score: 1,
        latencyMs: 100,
        costPerRequest: 0.001,
      },
      {
        score: 0.8,
        latencyMs: 200,
        costPerRequest: 0.002,
      },
    ]);

    expect(summary.quality).toBeCloseTo(0.9);
    expect(summary.averageLatency).toBe(150);
    expect(summary.averageCost).toBe(0.0015);
  });
});
