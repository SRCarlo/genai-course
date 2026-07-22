import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import morgan from "morgan";

import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 60000,

  max: 100,
});

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use(limiter);

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
