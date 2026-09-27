const MODELS = {
  small: "small-model",
  medium: "medium-model",
  large: "large-model"
};

/**
 * Cost-aware starter router.
 * Replace these placeholder model names with models you actually
 * benchmark in your project.
 */
export function chooseModel({
  complexity,
  maxBudget,
  requiresAdvancedReasoning = false
}) {
  if (requiresAdvancedReasoning || complexity === "HIGH") {
    return MODELS.large;
  }

  if (
    maxBudget !== undefined &&
    maxBudget < 0.01
  ) {
    return MODELS.small;
  }

  if (complexity === "MEDIUM") {
    return MODELS.medium;
  }

  return MODELS.small;
}

/**
 * Groq-only routing for this Day 106 project.
 * We use the requested openai/gpt-oss-20b model as the
 * actual live model. The routing label is kept for
 * evaluation/demo purposes.
 */
export function chooseGroqModel() {
  return "openai/gpt-oss-20b";
}