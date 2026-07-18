export function calculator(expression) {
  try {
    const result = Function(`"use strict"; return (${expression})`)();

    return result;
  } catch (error) {
    return "Invalid Expression";
  }
}
