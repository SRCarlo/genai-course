export const alertRules = [
  {
    id: "api-failure-rate-high", service: "genai-api", severity: "SEV-2",
    metric: "apiFailureRate", operator: "gt", threshold: 0.05,
    minimumSamples: 100, durationMinutes: 5,
    summary: "API failure rate is above 5%", runbook: "runbooks/genai-api-outage.md",
  },
  {
    id: "api-p95-latency-high", service: "genai-api", severity: "SEV-3",
    metric: "apiP95LatencyMs", operator: "gt", threshold: 800,
    minimumSamples: 100, durationMinutes: 10,
    summary: "API p95 latency exceeds 800 ms", runbook: "runbooks/genai-api-outage.md",
  },
  {
    id: "llm-provider-failure-high", service: "genai-api", severity: "SEV-2",
    metric: "llmFailureRate", operator: "gt", threshold: 0.02,
    minimumSamples: 50, durationMinutes: 5,
    summary: "LLM provider failure rate is above 2%", runbook: "runbooks/genai-api-outage.md",
  },
];
