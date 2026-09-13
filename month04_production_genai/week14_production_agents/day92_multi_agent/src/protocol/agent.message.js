import crypto from "crypto";

export function createAgentMessage({ from, to, type, payload }) {
  return {
    id: crypto.randomUUID(),

    from,

    to,

    type,

    payload,

    createdAt: new Date().toISOString(),
  };
}
