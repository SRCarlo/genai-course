import crypto from "node:crypto";

export function createRequestId() {
  return crypto.randomUUID();
}

export function startTrace() {
  return {
    startedAt: process.hrtime.bigint(),
  };
}

export function endTrace(trace) {
  const elapsed = process.hrtime.bigint() - trace.startedAt;

  return Number(elapsed) / 1_000_000;
}
