import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const hf = new HfInference(process.env.HF_TOKEN);

async function generateEmbedding(text) {
  try {
    const result = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    console.log("Dimensions:", result.length);
    console.log("First 10 values:");
    console.log(result.slice(0, 10));

    return result;

  } catch (error) {
    console.error(error.message);
  }
}

generateEmbedding(
  "Node.js is a JavaScript runtime."
);