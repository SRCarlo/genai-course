import dotenv from "dotenv";

dotenv.config();

import express from "express";

import agentRoutes from "./routes/agentRoutes.js";

const app = express();

app.use(express.json());

app.use("/", agentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
