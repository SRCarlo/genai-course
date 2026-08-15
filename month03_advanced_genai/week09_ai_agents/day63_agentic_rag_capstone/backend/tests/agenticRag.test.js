import { ragSearchTool } from "../tools/ragSearchTool.js";

import { calculatorTool } from "../tools/calculatorTool.js";

describe("Agentic RAG Integration", () => {
  test("RAG only workflow", async () => {
    const result = await ragSearchTool({
      query: "refund policy",

      topK: 5,
    });

    expect(result.found).toBe(true);

    expect(result.results.length).toBeGreaterThan(0);

    const refundResult = result.results.find(
      (item) => item.source === "refund-policy.txt",
    );

    expect(refundResult).toBeDefined();
  });

  test("calculator only workflow", () => {
    const result = calculatorTool({
      a: 80000,
      b: 15,
      operation: "percentage",
    });

    expect(result).toBe(12000);
  });

  test("RAG + calculator workflow", async () => {
    /*
     * Step 1:
     * Retrieve bonus policy.
     */

    const ragResult = await ragSearchTool({
      query: "bonus policy",

      topK: 5,
    });

    expect(ragResult.found).toBe(true);

    const bonusResult = ragResult.results.find(
      (item) => item.source === "bonus-policy.txt",
    );

    expect(bonusResult).toBeDefined();

    /*
     * Step 2:
     * Calculate 10% of 60000.
     */

    const calculation = calculatorTool({
      a: 60000,
      b: 10,
      operation: "percentage",
    });

    expect(calculation).toBe(6000);
  });

  test("unknown knowledge returns no relevant result", async () => {
    const result = await ragSearchTool({
      query: "Mars colonization policy",

      topK: 5,
    });

    /*
     * Depending on your vector
     * similarity threshold,
     * this should normally be false.
     */

    expect(result.found).toBe(false);
  });

  test("refund policy contains required information", async () => {
    const result = await ragSearchTool({
      query: "refund time limit",

      topK: 5,
    });

    expect(result.found).toBe(true);

    const combinedText = result.results.map((item) => item.content).join(" ");

    expect(combinedText.toLowerCase()).toContain("30 days");
  });

  test("bonus policy contains 10 percent information", async () => {
    const result = await ragSearchTool({
      query: "performance bonus eligible salary",

      topK: 5,
    });

    expect(result.found).toBe(true);

    const combinedText = result.results.map((item) => item.content).join(" ");

    expect(combinedText.toLowerCase()).toContain("10%");
  });
});
