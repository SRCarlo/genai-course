import { createHandoff } from "../src/protocol/handoff.js";

describe("Agent Handoff", () => {
  test("creates valid handoff", () => {
    const handoff = createHandoff({
      from: "support-agent",

      to: "billing-agent",

      reason: "payment_issue",

      context: {
        orderId: "12345",
      },
    });

    expect(handoff.from).toBe("support-agent");

    expect(handoff.to).toBe("billing-agent");

    expect(handoff.type).toBe("HANDOFF");

    expect(handoff.payload.reason).toBe("payment_issue");
  });
});
