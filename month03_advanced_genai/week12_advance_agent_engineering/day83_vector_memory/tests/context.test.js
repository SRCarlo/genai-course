import test from "node:test";
import assert from "node:assert/strict";

import { buildMemoryContext } from "../src/memory/context.builder.js";

test("builds memory context", () => {
  const memories = [
    {
      content: "User prefers Node.js",
    },
    {
      content: "User is learning backend development",
    },
    {
      content: "User wants to become a GenAI engineer",
    },
  ];

  const context = buildMemoryContext(memories);

  assert.match(context, /Node\.js/);

  assert.match(context, /backend/);

  assert.match(context, /GenAI/);
});
