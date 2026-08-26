import {
  getPrompt,
  listPromptVersions,
} from "../src/prompts/prompt.registry.js";

describe("Prompt Registry", () => {
  test("should contain all prompt versions", () => {
    const versions = listPromptVersions();

    expect(versions).toEqual(["v1", "v2", "v3"]);
  });

  test("should return V1", () => {
    const prompt = getPrompt("v1");

    expect(prompt).toContain("helpful assistant");
  });

  test("should return V2", () => {
    const prompt = getPrompt("v2");

    expect(prompt).toContain("professional technical assistant");
  });

  test("should return V3", () => {
    const prompt = getPrompt("v3");

    expect(prompt).toContain("senior");
  });

  test("should reject unknown prompt version", () => {
    expect(() => {
      getPrompt("v999");
    }).toThrow();
  });
});
