import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import healthRoute from "./routes/health.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/health", healthRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Career Assistant API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
