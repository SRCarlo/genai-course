import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json([
    {
      score: 92,

      summary: "Strong technical skills. Improve project section.",

      createdAt: new Date(),
    },

    {
      score: 85,

      summary: "Good experience. Add more AI projects.",

      createdAt: new Date(),
    },
  ]);
});

export default router;
