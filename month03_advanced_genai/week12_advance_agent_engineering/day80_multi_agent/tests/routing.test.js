import { route } from "../src/orchestration/router.js";

describe("Agent Router", () => {
  test("routes research task", () => {
    expect(route("Research JWT authentication")).toBe("researcher");
  });

  test("routes coding task", () => {
    expect(route("Implement JWT authentication")).toBe("coder");
  });

  test("routes review task", () => {
    expect(route("Review this code for security bugs")).toBe("reviewer");
  });
});
