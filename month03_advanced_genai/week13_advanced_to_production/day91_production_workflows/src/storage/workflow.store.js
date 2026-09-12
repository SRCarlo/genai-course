export class WorkflowStore {
  constructor() {
    this.workflows = new Map();
    this.idempotency = new Map();
  }

  async create(state) {
    this.workflows.set(state.workflowId, structuredClone(state));
    return structuredClone(state);
  }

  async save(state, expectedVersion = null) {
    const current = this.workflows.get(state.workflowId);

    if (!current) {
      throw new Error("WORKFLOW_NOT_FOUND");
    }

    if (expectedVersion !== null && current.version !== expectedVersion) {
      const error = new Error("CONCURRENCY_CONFLICT");
      error.code = "CONCURRENCY_CONFLICT";
      throw error;
    }

    const next = structuredClone(state);
    next.version = current.version + 1;
    next.updatedAt = new Date().toISOString();

    this.workflows.set(state.workflowId, next);
    return structuredClone(next);
  }

  async load(workflowId) {
    const state = this.workflows.get(workflowId);
    return state ? structuredClone(state) : null;
  }

  async list() {
    return [...this.workflows.values()].map(structuredClone);
  }

  async setIdempotency(key, value) {
    this.idempotency.set(key, structuredClone(value));
  }

  async getIdempotency(key) {
    const value = this.idempotency.get(key);
    return value ? structuredClone(value) : null;
  }
}
