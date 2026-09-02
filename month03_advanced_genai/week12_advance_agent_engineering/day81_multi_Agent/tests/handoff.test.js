import { describe, it, expect } from "vitest";

import { createHandoff } from "../src/orchestration/handoff.js";

import { validateHandoff } from "../src/orchestration/schemas.js";

describe("Handoff", () => {
  it("creates valid handoff", () => {
    const handoff = createHandoff({
      from: "researcher",

      to: "coder",

      task: "Implement Redis caching",

      context: {
        requirements: ["TTL", "Redis connection"],
      },

      result: {
        findings: [],
      },
    });

    const validated = validateHandoff(handoff);

    expect(validated.from).toBe("researcher");

    expect(validated.to).toBe("coder");

    expect(validated.type).toBe("handoff");

    expect(validated.id).toBeDefined();
  });
});
