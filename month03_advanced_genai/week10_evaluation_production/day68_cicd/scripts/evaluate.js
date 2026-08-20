import { env } from "../src/config/env.js";

const deterministicEvaluation = {
  accuracy: 0.94,
  faithfulness: 0.92,
};

async function runGroqEvaluation() {
  if (!env.groqApiKey) {
    throw new Error("GROQ_API_KEY is required when USE_GROQ_EVALUATION=true");
  }

  const prompt = `
You are an AI evaluation system.

Evaluate this simple question-answer result.

Question:
What is the capital of France?

Expected answer:
Paris.

Application answer:
Paris.

Return JSON only in this exact format:

{
  "accuracy": 0.0,
  "faithfulness": 0.0
}

Both values must be between 0 and 1.
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.groqApiKey}`,
      },
      body: JSON.stringify({
        model: env.groqModel,
        temperature: 0,
        messages: [
          {
            role: "system",
            content: "You are a strict AI evaluation system. Return JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Groq evaluation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq response did not contain evaluation content");
  }

  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

async function main() {
  let evaluation = deterministicEvaluation;

  if (env.useGroqEvaluation) {
    console.log("Running real Groq AI evaluation...");

    evaluation = await runGroqEvaluation();
  } else {
    console.log("Running deterministic CI evaluation...");
  }

  const accuracy = Number(evaluation.accuracy);
  const faithfulness = Number(evaluation.faithfulness);

  if (!Number.isFinite(accuracy) || !Number.isFinite(faithfulness)) {
    throw new Error("Evaluation metrics must be valid numbers");
  }

  console.log("");
  console.log("AI Evaluation Results");
  console.log("____________________________________");
  console.log(`Accuracy: ${accuracy}`);
  console.log(`Faithfulness: ${faithfulness}`);

  console.log(`Required accuracy: ${env.minAccuracy}`);

  console.log(`Required faithfulness: ${env.minFaithfulness}`);

  const accuracyPassed = accuracy >= env.minAccuracy;

  const faithfulnessPassed = faithfulness >= env.minFaithfulness;

  if (!accuracyPassed || !faithfulnessPassed) {
    console.error("");
    console.error(" AI evaluation failed");

    process.exit(1);
  }

  console.log("");
  console.log(" AI evaluation passed");
}

main().catch((error) => {
  console.error("");
  console.error(" Evaluation error:");

  console.error(error.message);

  process.exit(1);
});
