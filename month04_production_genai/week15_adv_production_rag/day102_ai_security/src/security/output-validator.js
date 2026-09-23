export function validateOutput(output) {
  if (!output || typeof output !== "object") {
    throw new Error("Invalid output");
  }

  if (typeof output.answer !== "string") {
    throw new Error("Invalid answer");
  }

  if (!Array.isArray(output.sources)) {
    throw new Error("Invalid sources");
  }

  return true;
}

export function parseAndValidateModelOutput(modelOutput) {
  let parsed;

  try {
    parsed = JSON.parse(modelOutput);
  } catch {
    throw new Error("Model output is not valid JSON");
  }

  validateOutput(parsed);

  return parsed;
}
