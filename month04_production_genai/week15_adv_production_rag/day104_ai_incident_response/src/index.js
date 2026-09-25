import {
  disableAI,
  enableAI,
  isAIEnabled,
  requireAIEnabled,
} from "./security/kill-switch.js";
import { getFeatures, setFeature } from "./security/feature-flags.js";
import { createRequestId } from "./observability/request-id.js";
import { CircuitBreaker } from "./resilience/circuit-breaker.js";
import { retrievalFallback } from "./resilience/fallback.js";
import {
  createIncident,
  transitionIncident,
} from "./security/incident-state.js";

console.log("=== Day 104: AI Incident Response Demo ===");

console.log("\nRequest ID:", createRequestId());

console.log("\nAI enabled:", isAIEnabled());
disableAI();
console.log("After kill switch:", isAIEnabled());

try {
  requireAIEnabled();
} catch (error) {
  console.log("Blocked request:", error.message);
}

enableAI();
console.log("AI re-enabled:", isAIEnabled());

console.log("\nFeature flags:", getFeatures());
setFeature("tools", false);
console.log("Tools disabled:", getFeatures());

console.log("\nRetrieval fallback:", retrievalFallback());

const breaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 1000,
});

for (let i = 1; i <= 3; i += 1) {
  breaker.recordFailure();
  console.log(`Failure ${i}:`, breaker.state);
}

console.log("Circuit allows request:", breaker.canRequest());

const incident = createIncident({
  id: "INC-2026-001",
  type: "TENANT_ISOLATION_FAILURE",
  severity: "SEV-1",
  message: "Unauthorized cross-tenant document access detected.",
});

let current = incident;
for (const nextState of [
  "TRIAGED",
  "CONTAINED",
  "INVESTIGATING",
  "REMEDIATED",
  "RECOVERED",
  "CLOSED",
]) {
  current = transitionIncident(current, nextState);
}

console.log("\nFinal incident:", current);
