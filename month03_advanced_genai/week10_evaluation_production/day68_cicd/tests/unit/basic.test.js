import test from "node:test";
import assert from "node:assert/strict";

test("basic application test", () => {
  const result = 2 + 2;

  assert.equal(result, 4);
});
