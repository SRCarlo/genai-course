import Resume from "../models/Resume.js";

// Get all resume analyses

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single resume

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,

      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete resume

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,

      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await resume.deleteOne();

    res.json({
      message: "Resume deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
