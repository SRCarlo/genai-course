// Educational starting targets only; set production targets using real workload data.
export const sloConfig = {
  window: "rolling-30d",
  api: { successRate: 0.995, latencyP95Ms: 800 },
  model: { successRate: 0.99 },
};
