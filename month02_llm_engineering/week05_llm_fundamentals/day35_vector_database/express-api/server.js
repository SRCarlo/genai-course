import express from "express";
import searchRouter from "./routes/search.js";

const app = express();

app.use(express.json());

app.use("/", searchRouter);

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});
