import { Router as ExpressRouter } from "express";

import { SharedState } from "../state/shared.state.js";

import { Workflow } from "../orchestration/workflow.js";

export function createAgentRoutes({ executor, approvalManager, router }) {
  const routes = ExpressRouter();

  // ===============================
  // RUN WORKFLOW
  // ===============================

  routes.post("/run", async (req, res) => {
    try {
      const { task } = req.body;

      if (!task || typeof task !== "string") {
        return res.status(400).json({
          success: false,

          error: "task must be a non-empty string",
        });
      }

      const state = new SharedState({
        maxSteps: 10,

        maxReviewAttempts: 3,
      });

      const workflow = new Workflow(executor, state);

      const result = await workflow.run(task);

      return res.json({
        success: true,

        result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  });

  // ===============================
  // LIST AGENTS
  // ===============================

  routes.get("/agents", (req, res) => {
    res.json({
      agents: router.list(),
    });
  });

  // ===============================
  // APPROVALS
  // ===============================

  routes.get("/approvals", (req, res) => {
    res.json({
      approvals: approvalManager.list(),
    });
  });

  // ===============================
  // APPROVE
  // ===============================

  routes.post("/approvals/:id/approve", (req, res) => {
    try {
      const result = approvalManager.approve(req.params.id);

      res.json({
        success: true,

        approval: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,

        error: error.message,
      });
    }
  });

  // ===============================
  // REJECT
  // ===============================

  routes.post("/approvals/:id/reject", (req, res) => {
    try {
      const result = approvalManager.reject(req.params.id);

      res.json({
        success: true,

        approval: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,

        error: error.message,
      });
    }
  });

  return routes;
}
