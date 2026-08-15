export function calculatorTool({ a, b, operation }) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Calculator inputs must be numbers");
  }

  switch (operation) {
    case "add":
      return a + b;

    case "subtract":
      return a - b;

    case "multiply":
      return a * b;

    case "divide":
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }

      return a / b;

    case "percentage":
      return (a * b) / 100;

    default:
      throw new Error("Unsupported operation");
  }
}
