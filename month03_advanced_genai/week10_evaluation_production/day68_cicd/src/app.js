import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "day68-cicd",
    message: "GenAI CI/CD application is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.get("/api/version", (req, res) => {
  res.json({
    version: "day68",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

export default app;
