import "dotenv/config";
import express from "express";
import { v4 as uuid } from "uuid";

import { WorkflowStore } from "./storage/workflow.store.js";
import { createWorkflowState, WorkflowStatus } from "./workflow/workflow.state.js";
import { runWorkflow } from "./workflow/workflow.runner.js";
import { resumeWorkflow, cancelWorkflow } from "./workflow/workflow.recovery.js";
import { AgentExecutor } from "./agent/agent.executor.js";
import { JobQueue } from "./jobs/job.js";
import { createWorkflowWorker } from "./jobs/job.worker.js";
import { approveApproval, rejectApproval } from "./approval/approval.service.js";

const app = express();
app.use(express.json());

const store = new WorkflowStore();
const agent = new AgentExecutor();
const queue = new JobQueue();

const dependencies = {
  store,
  agent,
  maxRetries: Number(process.env.MAX_RETRIES || 3),
  policy: {
    threshold: Number(process.env.REFUND_APPROVAL_THRESHOLD || 10000)
  },
  resumeWorkflow: async workflowId => resumeWorkflow(workflowId, store, dependencies)
};

queue.start(createWorkflowWorker(dependencies));

app.get("/", (_req, res) => {
  res.json({
    service: "Day 91 - Production Agent Workflows",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    status: "running"
  });
});

app.post("/workflows/refund", async (req, res) => {
  try {
    const { userId = "user-1", orderId = "12345" } = req.body;

    const workflowId = `wf-${uuid()}`;
    const state = createWorkflowState({
      workflowId,
      userId,
      orderId: String(orderId),
      goal: `Refund order ${orderId} if the order is eligible.`
    });

    state.audit.push({
      event: "WorkflowCreated",
      at: new Date().toISOString()
    });

    await store.create(state);
    queue.enqueue({ id: uuid(), workflowId });

    res.status(202).json({
      workflowId,
      status: "queued"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/workflows/:workflowId", async (req, res) => {
  const state = await store.load(req.params.workflowId);

  if (!state) {
    return res.status(404).json({ error: "WORKFLOW_NOT_FOUND" });
  }

  res.json(state);
});

app.post("/workflows/:workflowId/resume", async (req, res) => {
  try {
    const state = await resumeWorkflow(req.params.workflowId, store, dependencies);
    res.json(state);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/workflows/:workflowId/cancel", async (req, res) => {
  try {
    const state = await cancelWorkflow(req.params.workflowId, store);
    res.json(state);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/approvals/:workflowId/approve", async (req, res) => {
  try {
    const state = await store.load(req.params.workflowId);
    if (!state) return res.status(404).json({ error: "WORKFLOW_NOT_FOUND" });

    await approveApproval(state, req.body.approvedBy || "admin");

    // Resume from the approval step.
    const approvalIndex = state.steps.findIndex(step => step.id === "approval");
    state.steps[approvalIndex].status = "completed";
    state.status = WorkflowStatus.RUNNING;

    await store.save(state);
    const resumed = await resumeWorkflow(state.workflowId, store, dependencies);

    res.json(resumed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/approvals/:workflowId/reject", async (req, res) => {
  try {
    const state = await store.load(req.params.workflowId);
    if (!state) return res.status(404).json({ error: "WORKFLOW_NOT_FOUND" });

    await rejectApproval(state, req.body.rejectedBy || "admin");
    state.status = WorkflowStatus.CANCELLED;
    state.audit.push({
      event: "ApprovalRejected",
      at: new Date().toISOString()
    });

    await store.save(state);
    res.json(state);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/workflows", async (_req, res) => {
  res.json(await store.list());
});

const port = Number(process.env.PORT || 3000);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Day 91 workflow server running on http://localhost:${port}`);
    console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
  });
}

export { app, store, dependencies, queue };
