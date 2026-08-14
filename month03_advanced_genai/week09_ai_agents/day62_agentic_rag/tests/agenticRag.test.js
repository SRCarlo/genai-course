import test from "node:test";
import assert from "node:assert/strict";

import { SourceTracker } from "../backend/rag/sourceTracker.js";

test("source tracker stores unique chunks", () => {
  const tracker = new SourceTracker();

  tracker.add([
    {
      sourceId: "doc-001",

      title: "Refund Policy",

      source: "refund-policy.md",

      chunkId: "refund-001",

      score: 0.91,
    },
  ]);

  tracker.add([
    {
      sourceId: "doc-001",

      title: "Refund Policy",

      source: "refund-policy.md",

      chunkId: "refund-001",

      score: 0.91,
    },
  ]);

  assert.equal(tracker.getAll().length, 1);
});
