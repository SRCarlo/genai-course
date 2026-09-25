import "dotenv/config";
import express from "express";

import { disableAI, enableAI, isAIEnabled } from "./security/kill-switch.js";

import { getFeatures, setFeature } from "./security/feature-flags.js";

import {
  createIncident,
  transitionIncident,
} from "./security/incident-state.js";

import { createRequestId } from "./observability/request-id.js";

import { generateIncidentAnalysis } from "./ai/groq-client.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/* Health */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day104-ai-incident-response",
    aiEnabled: isAIEnabled(),
    timestamp: new Date().toISOString(),
  });
});

/* Kill switch status */
app.get("/api/ai/status", (req, res) => {
  res.json({
    aiEnabled: isAIEnabled(),
  });
});

/* Disable AI */
app.post("/api/ai/disable", (req, res) => {
  disableAI();

  res.json({
    success: true,
    message: "AI functionality disabled",
    aiEnabled: isAIEnabled(),
  });
});

/* Enable AI */
app.post("/api/ai/enable", (req, res) => {
  enableAI();

  res.json({
    success: true,
    message: "AI functionality enabled",
    aiEnabled: isAIEnabled(),
  });
});

/* Feature flags */
app.get("/api/features", (req, res) => {
  res.json(getFeatures());
});

app.patch("/api/features/:feature", (req, res) => {
  const { feature } = req.params;
  const { enabled } = req.body;

  try {
    setFeature(feature, enabled);

    res.json({
      success: true,
      features: getFeatures(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/* Create incident */
app.post("/api/incidents", (req, res) => {
  const requestId = createRequestId();

  const { id, type, severity, message } = req.body;

  if (!id || !type || !severity || !message) {
    return res.status(400).json({
      success: false,
      error: "id, type, severity and message are required",
    });
  }

  const incident = createIncident({
    id,
    type,
    severity,
    message,
    requestId,
  });

  res.status(201).json({
    success: true,
    requestId,
    incident,
  });
});

/* Update incident state */
app.patch("/api/incidents/:id/state", (req, res) => {
  const { from, to } = req.body;

  try {
    const incident = {
      id: req.params.id,
      status: from,
      updatedAt: new Date().toISOString(),
    };

    const updatedIncident = transitionIncident(incident, to);

    res.json({
      success: true,
      incident: updatedIncident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/* Groq incident analysis */
app.post("/api/incidents/analyze", async (req, res) => {
  const requestId = createRequestId();

  if (!isAIEnabled()) {
    return res.status(503).json({
      success: false,
      requestId,
      error: "AI functionality temporarily disabled",
    });
  }

  try {
    const { incident, evidence = [] } = req.body;

    if (!incident) {
      return res.status(400).json({
        success: false,
        requestId,
        error: "incident is required",
      });
    }

    const analysis = await generateIncidentAnalysis({
      incident,
      evidence,
    });

    res.json({
      success: true,
      requestId,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      requestId,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Day 104 server running at http://localhost:${PORT}`);
});
