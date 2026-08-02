import { generateAIResponse } from "../services/groqService.js";

import { resumeReviewPrompt } from "../services/promptService.js";

export const reviewResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,

        message: "Resume text required",
      });
    }

    const response = await generateAIResponse(
      resumeReviewPrompt.system,

      resumeReviewPrompt.user(resumeText),
    );

    res.json({
      success: true,

      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
