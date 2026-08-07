import express from "express";

import dotenv from "dotenv";

import evaluationRoutes from "./routes/evaluationRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/evaluation", evaluationRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
