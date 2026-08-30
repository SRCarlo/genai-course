export async function calculate({ expression }) {
  if (typeof expression !== "string") {
    throw new Error("Expression must be a string");
  }

  const cleaned = expression.replace(/\s+/g, "");

  // Handle percentage expressions such as "20% of 500"
  const percentageMatch = cleaned.match(/^([0-9.]+)%of([0-9.]+)$/i);

  if (percentageMatch) {
    const percentage = Number(percentageMatch[1]);
    const value = Number(percentageMatch[2]);

    return {
      expression,
      result: (percentage / 100) * value,
    };
  }

  // Handle regular mathematical expressions
  if (!/^[0-9+\-*/().%]+$/.test(cleaned)) {
    throw new Error("Unsupported mathematical expression");
  }

  const numbers = cleaned.match(/\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length < 1) {
    throw new Error("Invalid expression");
  }

  let result;

  try {
    result = Function(`"use strict"; return (${cleaned})`)();
  } catch {
    throw new Error("Invalid mathematical expression");
  }

  if (!Number.isFinite(result)) {
    throw new Error("Calculation returned an invalid number");
  }

  return {
    expression,
    result,
  };
}
