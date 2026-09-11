export function createTracer(state) {
  return {
    start(event, data = {}) {
      console.log(`[TRACE] ${event}`, {
        requestId: state.metadata.requestId,

        agentId: state.metadata.agentId,

        iteration: state.iteration,

        ...data,
      });
    },

    complete(event, data = {}) {
      console.log(`[TRACE] ${event} completed`, {
        requestId: state.metadata.requestId,

        agentId: state.metadata.agentId,

        iteration: state.iteration,

        ...data,
      });
    },

    error(event, error) {
      console.error(`[TRACE] ${event} failed`, {
        requestId: state.metadata.requestId,

        agentId: state.metadata.agentId,

        iteration: state.iteration,

        error: error.message,
      });
    },
  };
}
