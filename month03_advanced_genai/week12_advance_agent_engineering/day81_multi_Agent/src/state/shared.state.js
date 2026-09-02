import crypto from "crypto";

export class SharedState {
  constructor(initialState = {}) {
    this.state = {
      runId: crypto.randomUUID(),

      status: "created",

      currentAgent: null,

      currentAttempt: 0,

      step: 0,

      maxSteps: 10,

      reviewAttempts: 0,

      maxReviewAttempts: 3,

      retryAttempts: {},

      history: [],

      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },

      ...initialState,
    };
  }

  set(key, value) {
    this.state[key] = value;
  }

  get(key) {
    return this.state[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.state, key);
  }

  increment(key, amount = 1) {
    const current = Number(this.get(key) || 0);

    const value = current + amount;

    this.set(key, value);

    return value;
  }

  addHistory(entry) {
    this.state.history.push({
      timestamp: new Date().toISOString(),

      ...entry,
    });
  }

  addUsage(usage = {}) {
    const promptTokens = Number(usage.prompt_tokens || 0);

    const completionTokens = Number(usage.completion_tokens || 0);

    const totalTokens = Number(
      usage.total_tokens || promptTokens + completionTokens,
    );

    this.state.usage.promptTokens += promptTokens;

    this.state.usage.completionTokens += completionTokens;

    this.state.usage.totalTokens += totalTokens;
  }

  getAll() {
    return structuredClone(this.state);
  }

  clear() {
    this.state = {};
  }
}
