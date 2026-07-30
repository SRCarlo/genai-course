import { v4 as uuid } from "uuid";

let traces = [];

export function startTrace() {
  const id = uuid();

  traces.push({
    id,

    steps: [],
  });

  return id;
}

export function addTraceStep(id, step) {
  const trace = traces.find((item) => item.id === id);

  if (trace) {
    trace.steps.push({
      step,

      time: new Date(),
    });
  }
}

export function getTraces() {
  return traces;
}
