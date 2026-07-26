import express from "express";
import dotenv from "dotenv";
import routes from "./routes/agentRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/agent", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
