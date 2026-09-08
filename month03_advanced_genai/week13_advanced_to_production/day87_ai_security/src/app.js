import "dotenv/config";
import express from "express";
import { rateLimit } from "./middleware/rate.limit.js";
import { requestId } from "./middleware/request.id.js";
import secureChatRouter from "./routes/secure.chat.routes.js";
import toolRouter from "./routes/tool.routes.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(requestId);

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30)
  })
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "day87-ai-security",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b"
  });
});

app.use("/api", secureChatRouter);
app.use("/api/tools", toolRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found."
    }
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected server error occurred."
    }
  });
});

app.listen(port, () => {
  console.log(`Day 87 AI Security Gateway running on port ${port}`);
  console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
