import { execute } from "../workflows/agentWorkflow.js";

export async function run(req, res) {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,

        message: "Task is required",
      });
    }

    const result = await execute(task);

    res.json({
      success: true,

      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      error: err.message,
    });
  }
}
