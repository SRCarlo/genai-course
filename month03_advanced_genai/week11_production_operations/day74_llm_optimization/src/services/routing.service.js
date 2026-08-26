const SMALL_MODEL = "openai/gpt-oss-20b";

export function classifyComplexity(input = "") {
  const length = input.length;

  if (length < 500) {
    return "simple";
  }

  if (length < 3000) {
    return "medium";
  }

  return "complex";
}

export function chooseModel({
  input = "",
  qualityRequirement = 0.9,
  costBudget = 0.005,
  latencyBudgetMs = 2000,
}) {
  const complexity = classifyComplexity(input);

  // In this Day 74 project we intentionally keep
  // the actual model fixed to GPT-OSS 20B.
  //
  // The router architecture is still implemented so
  // another model can be introduced later.

  if (
    complexity === "simple" &&
    qualityRequirement <= 0.9 &&
    costBudget <= 0.005 &&
    latencyBudgetMs <= 2000
  ) {
    return {
      complexity,
      model: SMALL_MODEL,
      reason: "Simple request; use the configured cost-efficient model.",
    };
  }

  return {
    complexity,
    model: SMALL_MODEL,
    reason: "GPT-OSS 20B selected as the configured production model.",
  };
}
