import test from "node:test";
import assert from "node:assert/strict";

import { MIN_SIMILARITY } from "../backend/rag/retriever.js";

test("similarity threshold is configured", () => {
  assert.ok(MIN_SIMILARITY >= 0);

  assert.ok(MIN_SIMILARITY <= 1);
});
