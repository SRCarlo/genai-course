import test from "node:test";
import assert from "node:assert/strict";
import {
  canTransition,
  createIncident,
  transitionIncident,
} from "../../src/security/incident-state.js";

test("incident state machine accepts valid transitions", () => {
  assert.equal(canTransition("OPEN", "TRIAGED"), true);
  assert.equal(canTransition("OPEN", "CLOSED"), false);

  let incident = createIncident({
    id: "INC-TEST-001",
    type: "PROMPT_INJECTION",
    severity: "SEV-3",
    message: "Repeated prompt injection attempts",
  });

  incident = transitionIncident(incident, "TRIAGED");
  incident = transitionIncident(incident, "CONTAINED");

  assert.equal(incident.status, "CONTAINED");
});

test("incident state machine rejects invalid transitions", () => {
  const incident = createIncident({
    id: "INC-TEST-002",
    type: "DATA_LEAKAGE",
    severity: "SEV-1",
    message: "Sensitive output detected",
  });

  assert.throws(
    () => transitionIncident(incident, "CLOSED"),
    /Invalid incident transition/,
  );
});
