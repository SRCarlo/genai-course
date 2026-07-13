import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import embeddingRoute from "./routes/embedding.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

console.log("HF TOKEN:", process.env.HF_TOKEN ? "Loaded" : "Missing");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Embedding API running",
  });
});

app.use("/embedding", embeddingRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
