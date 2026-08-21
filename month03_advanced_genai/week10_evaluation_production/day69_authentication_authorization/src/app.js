import express from "express";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import documentRoutes from "./routes/document.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day69-authentication-authorization",
  });
});

app.use("/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api", aiRoutes);

app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
