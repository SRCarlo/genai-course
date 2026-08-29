export async function calculate({ a, b, operation }) {
  switch (operation) {
    case "add":
      return {
        success: true,
        data: a + b,
      };

    case "subtract":
      return {
        success: true,
        data: a - b,
      };

    case "multiply":
      return {
        success: true,
        data: a * b,
      };

    case "divide":
      if (b === 0) {
        return {
          success: false,
          error: "Cannot divide by zero",
        };
      }

      return {
        success: true,
        data: a / b,
      };

    default:
      return {
        success: false,
        error: "Unsupported operation",
      };
  }
}
