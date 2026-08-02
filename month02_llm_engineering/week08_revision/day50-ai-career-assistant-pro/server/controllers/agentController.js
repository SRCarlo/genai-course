import { careerAgent } from "../agents/careerAgent.js";

export const askAgent = async (req, res) => {
  try {
    const { type, query } = req.body;

    const result = await careerAgent(query, type);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
