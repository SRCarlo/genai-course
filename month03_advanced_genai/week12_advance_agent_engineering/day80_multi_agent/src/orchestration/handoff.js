import crypto from "node:crypto";

export function createHandoff({ from, to, task, context = {} }) {
  return {
    messageId: crypto.randomUUID(),

    from,

    to,

    type: "handoff",

    task,

    context,

    timestamp: new Date().toISOString(),
  };
}
