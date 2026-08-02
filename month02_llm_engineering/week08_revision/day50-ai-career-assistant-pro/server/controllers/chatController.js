import { retrieveContext } from "../rag/ragService.js";

import { generateAIResponse } from "../services/groqService.js";

export const chat = async (req, res) => {
  try {
    const { question } = req.body;

    const context = await retrieveContext(question);

    const answer = await generateAIResponse(
      `
Answer using this context:

${context}

`,

      question,
    );

    res.json({
      success: true,

      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
