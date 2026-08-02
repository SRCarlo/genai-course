import Resume from "../models/Resume.js";

import { extractPDFText } from "../services/pdfService.js";

import { generateAIResponse } from "../services/groqService.js";

import { resumeReviewPrompt } from "../services/promptService.js";

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,

        message: "PDF required",
      });
    }

    const text = await extractPDFText(file.path);

    const aiReview = await generateAIResponse(
      resumeReviewPrompt.system,

      resumeReviewPrompt.user(text),
    );

    const resume = await Resume.create({
      user: req.user._id,

      fileName: file.filename,

      filePath: file.path,

      resumeText: text,

      aiReview,
    });

    res.status(201).json({
      success: true,

      message: "Resume uploaded successfully",

      resume,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
