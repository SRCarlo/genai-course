import crypto from "crypto";

import MESSAGE_TYPES from "./message.types.js";

export function createHandoff({
  from,
  to,
  task,
  context = {},
  result = null,
  type = MESSAGE_TYPES.HANDOFF,
}) {
  if (!from) {
    throw new Error("Handoff requires 'from'");
  }

  if (!to) {
    throw new Error("Handoff requires 'to'");
  }

  if (!task) {
    throw new Error("Handoff requires 'task'");
  }

  return {
    id: crypto.randomUUID(),

    type,

    from,

    to,

    task,

    context,

    result,

    createdAt: new Date().toISOString(),
  };
}
