import { SharedState } from "../src/state/shared.state.js";

describe("Supervisor workflow", () => {
  test("shared state starts empty", () => {
    const state = new SharedState();

    expect(state.get("task")).toBeNull();

    expect(state.get("research")).toBeNull();

    expect(state.get("code")).toBeNull();

    expect(state.get("review")).toBeNull();
  });

  test("step counter works", () => {
    const state = new SharedState();

    state.incrementSteps();
    state.incrementSteps();

    expect(state.get("stepCount")).toBe(2);
  });
});
