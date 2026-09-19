import test from "node:test";
import assert from "node:assert/strict";
import { chunkText } from "../src/ingestion/chunker.js";

test("chunkText creates chunks", () => {
  const text = Array.from({ length: 25 }, (_, i) => `word${i}`).join(" ");
  const chunks = chunkText(text, {
    chunkSize: 10,
    overlap: 2
  });

  assert.ok(chunks.length > 1);
  assert.equal(chunks[0].index, 0);
});
