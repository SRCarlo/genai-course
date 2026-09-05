import { chunkText } from "../src/ingestion/chunker.js";

describe("chunkText", () => {
  test("creates chunks", () => {
    const text = "one two three four five six seven eight nine ten";

    const chunks = chunkText(text, 4, 1);

    expect(chunks.length).toBeGreaterThan(1);
  });

  test("returns empty array for empty text", () => {
    expect(chunkText("")).toEqual([]);
  });
});
