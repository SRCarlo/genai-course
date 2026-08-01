import { createRequire } from "module";

const require = createRequire(import.meta.url);

const pdf = require("pdf-parse");

import Resume from "../models/Resume.js";

import { analyzeResume } from "../services/aiService.js";

export const analyze = async (req, res) => {
  try {
    const data = await pdf(req.file.buffer);

    const resumeText = data.text;

    const result = await analyzeResume(resumeText);

    const resume = await Resume.create({
      user: req.user.id,

      resumeText,

      analysis: result,
    });

    req.user.usage += 1;

    await req.user.save();

    res.json({
      message: "Resume analyzed",

      analysis: result,

      id: resume._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
