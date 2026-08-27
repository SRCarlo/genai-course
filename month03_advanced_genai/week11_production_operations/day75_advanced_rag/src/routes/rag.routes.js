import express from "express";

import { advancedRAG } from "../rag/pipeline.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const {
      query,
      conversation = "",
      topK = 10,
      finalK = 5,
      metadataFilter = {},
      useQueryExpansion = false,
      maxContextTokens = 6000,
    } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "query must be a non-empty string",
      });
    }

    const result = await advancedRAG(query, {
      conversation,
      topK,
      finalK,
      metadataFilter,
      useQueryExpansion,
      maxContextTokens,
    });

    return res.json(result);
  } catch (error) {
    console.error("RAG error:", error);

    return res.status(500).json({
      error: error.message || "RAG request failed",
    });
  }
});

export default router;
