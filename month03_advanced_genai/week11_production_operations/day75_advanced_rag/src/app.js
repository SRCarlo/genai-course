import express from "express";
import ragRoutes from "./routes/rag.routes.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day75-advanced-rag",
  });
});

app.use("/api/rag", ragRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
