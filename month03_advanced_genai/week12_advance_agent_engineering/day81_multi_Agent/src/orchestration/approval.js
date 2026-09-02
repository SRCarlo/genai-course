import crypto from "crypto";

export class ApprovalManager {
  constructor() {
    this.pending = new Map();
  }

  requestApproval({ runId, action, details }) {
    const id = crypto.randomUUID();

    const request = {
      id,

      runId,

      action,

      details,

      status: "pending",

      createdAt: new Date().toISOString(),

      resolvedAt: null,
    };

    this.pending.set(id, request);

    return request;
  }

  approve(id) {
    const request = this.pending.get(id);

    if (!request) {
      throw new Error("Approval request not found");
    }

    request.status = "approved";

    request.resolvedAt = new Date().toISOString();

    return request;
  }

  reject(id) {
    const request = this.pending.get(id);

    if (!request) {
      throw new Error("Approval request not found");
    }

    request.status = "rejected";

    request.resolvedAt = new Date().toISOString();

    return request;
  }

  get(id) {
    return this.pending.get(id);
  }

  list() {
    return [...this.pending.values()];
  }
}
