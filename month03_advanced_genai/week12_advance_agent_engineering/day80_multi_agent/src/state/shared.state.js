export class SharedState {
  constructor() {
    this.data = {
      task: null,

      research: null,

      code: null,

      review: null,

      finalAnswer: null,

      plan: null,

      handoffs: [],

      traces: [],

      errors: [],

      stepCount: 0,
    };
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }

  incrementSteps() {
    this.data.stepCount += 1;
  }

  addHandoff(handoff) {
    this.data.handoffs.push(handoff);
  }

  addTrace(trace) {
    this.data.traces.push(trace);
  }

  addError(error) {
    this.data.errors.push(error);
  }
}
