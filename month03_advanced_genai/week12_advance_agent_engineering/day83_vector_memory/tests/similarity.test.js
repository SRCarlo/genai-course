import test from "node:test";
import assert from "node:assert/strict";

import { cosineSimilarity } from "../src/memory/vector.similarity.js";

test("identical vectors have similarity 1", () => {
  const result = cosineSimilarity([1, 0, 0], [1, 0, 0]);

  assert.equal(result, 1);
});

test("orthogonal vectors have similarity 0", () => {
  const result = cosineSimilarity([1, 0, 0], [0, 1, 0]);

  assert.equal(result, 0);
});

test("different dimensions throw", () => {
  assert.throws(() => cosineSimilarity([1, 0], [1, 0, 0]), /dimensions/);
});
