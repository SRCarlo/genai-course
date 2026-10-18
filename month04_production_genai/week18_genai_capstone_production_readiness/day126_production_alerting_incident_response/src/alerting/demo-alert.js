import { alertRules } from "./alert-rules.js";
import { evaluateAllAlerts } from "./evaluate-alerts.js";

const measurements = {
  apiFailureRate: { value: 0.08, sampleCount: 250 },
  apiP95LatencyMs: { value: 950, sampleCount: 250 },
  llmFailureRate: { value: 0.01, sampleCount: 100 },
};

for (const alert of evaluateAllAlerts(alertRules, measurements)) {
  console.log(JSON.stringify(alert));
}
