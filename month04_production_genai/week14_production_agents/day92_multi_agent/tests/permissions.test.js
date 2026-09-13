import {
  hasPermission,
  assertPermission,
} from "../src/policies/permissions.js";

describe("Agent Permissions", () => {
  test("research agent can research", () => {
    expect(hasPermission("nodeAgent", "research")).toBe(true);
  });

  test("research agent cannot refund", () => {
    expect(hasPermission("nodeAgent", "refund")).toBe(false);
  });

  test("invalid permission throws error", () => {
    expect(() => assertPermission("nodeAgent", "refund")).toThrow(
      "PERMISSION_DENIED",
    );
  });
});
