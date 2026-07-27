import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import memoryRoutes from "./routes/memoryRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Day 44 - AI Memory System API is Running.",
  });
});

// Memory Routes
app.use("/memory", memoryRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
