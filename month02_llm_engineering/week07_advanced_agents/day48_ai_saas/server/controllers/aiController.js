import { askAI } from "../services/aiService.js";
import User from "../models/User.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,

        message: "Resume text required",
      });
    }

    const prompt = `

Analyze this resume:

${resumeText}

Give:

1. Resume Score

2. Strengths

3. Weaknesses

4. Suggestions

5. Missing Skills

`;

    const result = await askAI(prompt);

    // Increase Usage Count

    req.user.usage += 1;

    await req.user.save();

    res.json({
      success: true,

      usage: req.user.usage,

      analysis: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
