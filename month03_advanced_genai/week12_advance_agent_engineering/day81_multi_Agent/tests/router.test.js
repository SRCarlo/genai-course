import { describe, it, expect } from "vitest";

import { Router } from "../src/orchestration/router.js";

describe("Router", () => {
  it("registers and retrieves agents", () => {
    const router = new Router();

    const fakeAgent = {
      name: "researcher",
    };

    router.register("researcher", fakeAgent);

    expect(router.has("researcher")).toBe(true);

    expect(router.get("researcher")).toBe(fakeAgent);
  });

  it("lists agents", () => {
    const router = new Router();

    router.register("researcher", {});

    router.register("coder", {});

    expect(router.list()).toEqual(["researcher", "coder"]);
  });
});
