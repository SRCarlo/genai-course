const pendingApprovals = new Map();

export function createApprovalRequest({
  requestId,
  toolName,
  arguments: toolArguments,
}) {
  const approvalId = `approval-${crypto.randomUUID()}`;

  const approval = {
    approvalId,
    requestId,
    toolName,
    arguments: toolArguments,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  pendingApprovals.set(approvalId, approval);

  return approval;
}

export function approveRequest(approvalId) {
  const approval = pendingApprovals.get(approvalId);

  if (!approval) {
    throw new Error("APPROVAL_NOT_FOUND");
  }

  approval.status = "approved";

  approval.approvedAt = new Date().toISOString();

  return approval;
}

export function rejectRequest(approvalId) {
  const approval = pendingApprovals.get(approvalId);

  if (!approval) {
    throw new Error("APPROVAL_NOT_FOUND");
  }

  approval.status = "rejected";

  approval.rejectedAt = new Date().toISOString();

  return approval;
}

export function getApproval(approvalId) {
  return pendingApprovals.get(approvalId);
}
