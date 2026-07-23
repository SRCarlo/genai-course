import model from "../config/groq.js";

import { calculator } from "../tools/calculator.js";

import { saveMemory } from "../memory/memory.js";

export async function askAgent(question) {
  let answer;

  if (question.includes("*")) {
    const numbers = question.match(/\d+/g);

    if (numbers && numbers.length === 2) {
      answer = calculator(Number(numbers[0]), Number(numbers[1])).toString();
    }
  }

  if (!answer) {
    const response = await model.invoke(question);

    answer = response.content;
  }

  saveMemory({
    question,

    answer,
  });

  return answer;
}
