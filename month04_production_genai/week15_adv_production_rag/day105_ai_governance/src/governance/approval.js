const actionRules = {
  SUMMARIZE_DOCUMENT: "AI_ALLOWED",
  SEARCH_KNOWLEDGE_BASE: "AI_ALLOWED",
  DRAFT_EMAIL: "AI_ALLOWED",
  SEND_SENSITIVE_EMAIL: "HUMAN_REQUIRED",
  DELETE_RECORD: "HUMAN_REQUIRED",
  HIGH_IMPACT_DECISION: "HUMAN_REQUIRED",
  BYPASS_SECURITY_CONTROL: "DENIED"
};

export function getApprovalDecision(action) {
  return actionRules[action] ?? "DENIED";
}

export function requiresApproval(action) {
  return getApprovalDecision(action) === "HUMAN_REQUIRED";
}

export function isActionAllowed(action) {
  return getApprovalDecision(action) === "AI_ALLOWED";
}

export function getApprovalMatrix() {
  return { ...actionRules };
}
