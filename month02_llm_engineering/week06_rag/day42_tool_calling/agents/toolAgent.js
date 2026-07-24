import { calculate } from "../tools/calculator.js";
import { getWeather } from "../tools/weather.js";
import { getRepo } from "../tools/github.js";

export async function handleQuestion(question) {
  const lower = question.toLowerCase();

  // Calculator

  if (question.includes("*")) {
    const numbers = question.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      const a = Number(numbers[0]);
      const b = Number(numbers[1]);

      return calculate("multiply", a, b);
    }
  }

  if (question.includes("+")) {
    const numbers = question.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      return calculate("add", Number(numbers[0]), Number(numbers[1]));
    }
  }

  if (question.includes("-")) {
    const numbers = question.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      return calculate("subtract", Number(numbers[0]), Number(numbers[1]));
    }
  }

  if (question.includes("/")) {
    const numbers = question.match(/\d+/g);

    if (numbers && numbers.length >= 2) {
      return calculate("divide", Number(numbers[0]), Number(numbers[1]));
    }
  }

  // Weather

  if (lower.includes("weather")) {
    const city = question.split(" ").pop();

    return await getWeather(city);
  }

  // GitHub

  if (lower.includes("github")) {
    return await getRepo();
  }

  return "Sorry, I don't know how to answer that.";
}
