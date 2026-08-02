import { extractPDFText } from "../services/pdfService.js";

import { chunkText } from "../rag/chunkService.js";

import { createEmbedding } from "../rag/embeddingService.js";

import { saveVector } from "../rag/vectorService.js";

export const uploadKnowledge = async (req, res) => {
  try {
    const text = await extractPDFText(req.file.path);

    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);

      await saveVector(
        chunk,

        embedding,

        req.file.filename,
      );
    }

    res.json({
      success: true,

      message: "Knowledge uploaded",

      chunks: chunks.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
