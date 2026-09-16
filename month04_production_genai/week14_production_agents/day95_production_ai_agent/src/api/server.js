import express from "express";
import { config, assertConfig } from "../config/config.js";
import { router } from "./routes.js";

assertConfig();

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error("[server-error]", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Agent API running on http://localhost:${config.port}`);
});
