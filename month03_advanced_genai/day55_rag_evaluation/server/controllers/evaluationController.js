import fs from "fs";

export async function runEvaluation(req, res) {
  const questions = JSON.parse(
    fs.readFileSync("./evaluation/questions.json", "utf8"),
  );

  res.json({
    totalQuestions: questions.length,

    questions,
  });
}
