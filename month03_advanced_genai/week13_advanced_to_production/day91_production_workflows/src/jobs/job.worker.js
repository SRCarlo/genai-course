export function createWorkflowWorker(dependencies) {
  return async function workflowWorker(job) {
    try {
      await dependencies.resumeWorkflow(job.workflowId);
    } catch (error) {
      console.error(`[worker] ${job.workflowId} failed:`, error.message);
    }
  };
}
