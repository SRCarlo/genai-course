export async function requestApproval({ workflowId, reason, amount }) {
  return {
    workflowId,
    status: "pending",
    reason,
    amount,
    createdAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null
  };
}

export async function approveApproval(state, approvedBy = "admin") {
  const approval = state.approvals.at(-1);

  if (!approval || approval.status !== "pending") {
    throw new Error("APPROVAL_NOT_PENDING");
  }

  approval.status = "approved";
  approval.approvedAt = new Date().toISOString();
  approval.approvedBy = approvedBy;

  return approval;
}

export async function rejectApproval(state, rejectedBy = "admin") {
  const approval = state.approvals.at(-1);

  if (!approval || approval.status !== "pending") {
    throw new Error("APPROVAL_NOT_PENDING");
  }

  approval.status = "rejected";
  approval.rejectedAt = new Date().toISOString();
  approval.rejectedBy = rejectedBy;

  return approval;
}
