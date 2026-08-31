export class AgentState {
  constructor({ userId, tenantId = "default" }) {
    this.userId = userId;
    this.tenantId = tenantId;

    this.currentTask = null;

    this.data = {};
  }

  setTask(task) {
    this.currentTask = task;
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  getAll() {
    return {
      currentTask: this.currentTask,

      data: {
        ...this.data,
      },
    };
  }

  clear() {
    this.currentTask = null;
    this.data = {};
  }
}
