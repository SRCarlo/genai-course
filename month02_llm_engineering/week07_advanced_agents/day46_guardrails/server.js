import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import securityRoutes from "./routes/securityRoutes.js";



const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", securityRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
