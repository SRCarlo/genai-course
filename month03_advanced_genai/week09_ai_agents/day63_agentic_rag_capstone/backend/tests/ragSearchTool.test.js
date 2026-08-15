import { ragSearchTool } from "../tools/ragSearchTool.js";

describe("RAG Search Tool", () => {
  test("throws error when query is empty", async () => {
    await expect(
      ragSearchTool({
        query: "",
      }),
    ).rejects.toThrow("Query is required");
  });

  test("throws error when query is missing", async () => {
    await expect(ragSearchTool({})).rejects.toThrow("Query is required");
  });

  test("returns a valid RAG response", async () => {
    const result = await ragSearchTool({
      query: "refund policy",
      topK: 5,
    });

    expect(result).toHaveProperty("found");

    expect(result).toHaveProperty("results");

    expect(Array.isArray(result.results)).toBe(true);
  });

  test("finds refund policy", async () => {
    const result = await ragSearchTool({
      query: "refund policy",
      topK: 5,
    });

    expect(result.found).toBe(true);

    expect(result.results.length).toBeGreaterThan(0);

    const hasRefundSource = result.results.some(
      (item) => item.source === "refund-policy.txt",
    );

    expect(hasRefundSource).toBe(true);
  });

  test("finds bonus policy", async () => {
    const result = await ragSearchTool({
      query: "bonus policy",
      topK: 5,
    });

    expect(result.found).toBe(true);

    const hasBonusSource = result.results.some(
      (item) => item.source === "bonus-policy.txt",
    );

    expect(hasBonusSource).toBe(true);
  });
});
