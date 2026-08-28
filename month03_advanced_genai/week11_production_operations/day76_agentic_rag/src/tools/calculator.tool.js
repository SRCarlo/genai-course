function validateExpression(expression) {
  if (typeof expression !== "string") {
    throw new Error("Expression must be a string.");
  }

  if (expression.length > 100) {
    throw new Error("Expression is too long.");
  }

  const allowedCharacters = /^[0-9+\-*/().%\s]+$/;

  if (!allowedCharacters.test(expression)) {
    throw new Error("Expression contains unsupported characters.");
  }

  return expression;
}

function tokenize(expression) {
  const tokens = expression.match(/(\d+(?:\.\d+)?)|([+\-*/%()])/g);

  if (!tokens) {
    throw new Error("Invalid expression.");
  }

  return tokens;
}

function parseExpression(tokens) {
  let position = 0;

  function parsePrimary() {
    const token = tokens[position];

    if (token === "(") {
      position++;

      const value = parseAdditive();

      if (tokens[position] !== ")") {
        throw new Error("Missing closing parenthesis.");
      }

      position++;

      return value;
    }

    if (token === "+" || token === "-") {
      position++;

      const value = parsePrimary();

      return token === "-" ? -value : value;
    }

    if (!token || !/^\d+(\.\d+)?$/.test(token)) {
      throw new Error("Expected a number.");
    }

    position++;

    return Number(token);
  }

  function parseMultiplicative() {
    let value = parsePrimary();

    while (
      position < tokens.length &&
      ["*", "/", "%"].includes(tokens[position])
    ) {
      const operator = tokens[position];

      position++;

      const right = parsePrimary();

      if (operator === "/" && right === 0) {
        throw new Error("Division by zero.");
      }

      if (operator === "*") {
        value *= right;
      }

      if (operator === "/") {
        value /= right;
      }

      if (operator === "%") {
        value %= right;
      }
    }

    return value;
  }

  function parseAdditive() {
    let value = parseMultiplicative();

    while (position < tokens.length && ["+", "-"].includes(tokens[position])) {
      const operator = tokens[position];

      position++;

      const right = parseMultiplicative();

      if (operator === "+") {
        value += right;
      }

      if (operator === "-") {
        value -= right;
      }
    }

    return value;
  }

  const result = parseAdditive();

  if (position !== tokens.length) {
    throw new Error("Invalid expression.");
  }

  return result;
}

export function calculate(expression) {
  const validatedExpression = validateExpression(expression);

  const tokens = tokenize(validatedExpression);

  const result = parseExpression(tokens);

  if (!Number.isFinite(result)) {
    throw new Error("Calculation produced an invalid result.");
  }

  return {
    success: true,
    expression: validatedExpression,
    result,
  };
}
