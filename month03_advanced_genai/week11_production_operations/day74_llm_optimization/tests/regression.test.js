import { calculateOptimizationStatus } from "../src/utils/metrics.js";

describe("Production Regression Gates", () => {
  test("should accept a configuration above all thresholds", () => {
    const result = calculateOptimizationStatus({
      quality: 0.95,
      latencyMs: 1000,
      costPerRequest: 0.002,
    });

    expect(result.accepted).toBe(true);
  });

  test("should reject low quality", () => {
    const result = calculateOptimizationStatus({
      quality: 0.8,
      latencyMs: 1000,
      costPerRequest: 0.002,
    });

    expect(result.qualityPass).toBe(false);
    expect(result.accepted).toBe(false);
  });

  test("should reject high latency", () => {
    const result = calculateOptimizationStatus({
      quality: 0.95,
      latencyMs: 3000,
      costPerRequest: 0.002,
    });

    expect(result.latencyPass).toBe(false);
    expect(result.accepted).toBe(false);
  });

  test("should reject high cost", () => {
    const result = calculateOptimizationStatus({
      quality: 0.95,
      latencyMs: 1000,
      costPerRequest: 0.01,
    });

    expect(result.costPass).toBe(false);
    expect(result.accepted).toBe(false);
  });
});
