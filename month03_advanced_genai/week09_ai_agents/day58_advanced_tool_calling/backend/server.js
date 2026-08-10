import express from "express";
import dotenv from "dotenv";

import agentRoutes from "./routes/agentRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Day 58 Multi-Tool Agent API",
  });
});

app.use("/api/agent", agentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
