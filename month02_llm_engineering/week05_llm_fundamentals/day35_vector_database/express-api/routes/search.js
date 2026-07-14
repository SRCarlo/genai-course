import express from "express";

const router = express.Router();

router.post("/search", async (req, res) => {
  const { query } = req.body;

  // Generate embedding
  // Compare vectors
  // Return best document

  res.json({
    query,
    result: "Node.js is used for backend development.",
  });
});

export default router;
