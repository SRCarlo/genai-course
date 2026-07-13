import express from "express";
import axios from "axios";

const router = express.Router();

const MODEL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

async function generateEmbedding(text) {
  const response = await axios.post(
    MODEL,

    {
      inputs: text,
    },

    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,

        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const embedding = await generateEmbedding(text);

    res.json({
      message: "Embedding generated successfully",

      text,

      dimensions: embedding.length,

      preview: embedding.slice(0, 10),
    });
  } catch (error) {
    console.error("HF Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Embedding generation failed",
    });
  }
});

export default router;
