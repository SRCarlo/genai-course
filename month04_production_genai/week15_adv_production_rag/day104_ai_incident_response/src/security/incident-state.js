export const INCIDENT_STATES = Object.freeze([
  "OPEN",
  "TRIAGED",
  "CONTAINED",
  "INVESTIGATING",
  "REMEDIATED",
  "RECOVERED",
  "CLOSED",
]);

const validTransitions = Object.freeze({
  OPEN: ["TRIAGED"],
  TRIAGED: ["CONTAINED"],
  CONTAINED: ["INVESTIGATING"],
  INVESTIGATING: ["REMEDIATED"],
  REMEDIATED: ["RECOVERED"],
  RECOVERED: ["CLOSED"],
});

export function canTransition(from, to) {
  return validTransitions[from]?.includes(to) ?? false;
}

export function transitionIncident(incident, to) {
  if (!canTransition(incident.status, to)) {
    throw new Error(`Invalid incident transition: ${incident.status} -> ${to}`);
  }

  return {
    ...incident,
    status: to,
    updatedAt: new Date().toISOString(),
  };
}

export function createIncident({
  id,
  type,
  severity,
  message,
  requestId = null,
}) {
  return {
    id,
    type,
    severity,
    message,
    requestId,
    status: "OPEN",
    detectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
