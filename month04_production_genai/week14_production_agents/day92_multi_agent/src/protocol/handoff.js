import { createAgentMessage } from "./agent.message.js";

export function createHandoff({ from, to, reason, context }) {
  return createAgentMessage({
    from,
    to,
    type: "HANDOFF",

    payload: {
      reason,
      context,
    },
  });
}
