const retentionPolicies = {
  prompts: 30,
  responses: 30,
  securityLogs: 180,
  auditLogs: 365,
  evaluationReports: 365,
  incidentRecords: 365
};

export function getRetentionDays(type) {
  return retentionPolicies[type];
}

export function getRetentionPolicies() {
  return { ...retentionPolicies };
}
