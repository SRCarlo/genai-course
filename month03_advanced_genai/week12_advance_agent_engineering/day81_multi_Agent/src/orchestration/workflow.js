import { createHandoff } from "./handoff.js";

import { validateHandoff } from "./schemas.js";

import { logger } from "./logger.js";

export class Workflow {
  constructor(executor, state) {
    this.executor = executor;

    this.state = state;
  }

  async run(task) {
    this.state.set("task", task);

    this.state.set("status", "running");

    logger.info("Workflow started", {
      runId: this.state.get("runId"),
    });

    try {
      // =================================
      // RESEARCH
      // =================================

      let research;

      try {
        research = await this.executor.execute("researcher", task, this.state);
      } catch (primaryError) {
        logger.warn("Primary researcher failed, using fallback", {
          error: primaryError.message,
        });

        research = await this.executor.execute(
          "fallback-researcher",
          task,
          this.state,
        );
      }

      if (!research.success) {
        throw new Error(research.error);
      }

      // =================================
      // RESEARCHER -> CODER HANDOFF
      // =================================

      const researchHandoff = createHandoff({
        from: "researcher",

        to: "coder",

        task: "Implement the requested solution",

        context: {
          originalTask: task,
        },

        result: research.data,
      });

      validateHandoff(researchHandoff);

      this.state.set("researchHandoff", researchHandoff);

      this.state.addHistory({
        type: "handoff",

        from: "researcher",

        to: "coder",
      });

      // =================================
      // CODER
      // =================================

      let code = await this.executor.execute(
        "coder",
        research.data,
        this.state,
      );

      if (!code.success) {
        throw new Error(code.error);
      }

      // =================================
      // CODER -> REVIEWER HANDOFF
      // =================================

      const codeHandoff = createHandoff({
        from: "coder",

        to: "reviewer",

        task: "Review the implementation",

        context: {
          originalTask: task,
        },

        result: code.data,
      });

      validateHandoff(codeHandoff);

      this.state.set("codeHandoff", codeHandoff);

      this.state.addHistory({
        type: "handoff",

        from: "coder",

        to: "reviewer",
      });

      // =================================
      // REVIEW LOOP
      // =================================

      while (true) {
        const reviewAttempt = this.state.increment("reviewAttempts");

        if (reviewAttempt > this.state.get("maxReviewAttempts")) {
          throw new Error("Maximum review attempts exceeded");
        }

        logger.info("Review started", {
          runId: this.state.get("runId"),

          attempt: reviewAttempt,
        });

        const review = await this.executor.execute(
          "reviewer",
          code.data,
          this.state,
        );

        if (!review.success) {
          throw new Error(review.error);
        }

        this.state.set("review", review.data);

        // =================================
        // APPROVED
        // =================================

        if (review.data.approved) {
          this.state.addHistory({
            type: "review",

            attempt: reviewAttempt,

            approved: true,
          });

          break;
        }

        // =================================
        // REJECTED
        // =================================

        this.state.addHistory({
          type: "review",

          attempt: reviewAttempt,

          approved: false,

          issues: review.data.issues,
        });

        this.state.set("reviewFeedback", review.data);

        const feedbackHandoff = createHandoff({
          from: "reviewer",

          to: "coder",

          task: "Improve the implementation using reviewer feedback",

          context: {
            feedback: review.data,
          },

          result: this.state.get("code"),
        });

        validateHandoff(feedbackHandoff);

        this.state.set("feedbackHandoff", feedbackHandoff);

        // =================================
        // CODER IMPROVEMENT
        // =================================

        code = await this.executor.execute(
          "coder",

          {
            previousCode: this.state.get("code"),

            feedback: review.data,
          },

          this.state,
        );

        if (!code.success) {
          throw new Error(code.error);
        }

        this.state.set("code", code.data);
      }

      // =================================
      // FINAL
      // =================================

      this.state.set("status", "completed");

      this.state.set("currentAgent", null);

      logger.info("Workflow completed", {
        runId: this.state.get("runId"),
      });

      return this.state.getAll();
    } catch (error) {
      this.state.set("status", "failed");

      this.state.set("error", error.message);

      logger.error("Workflow failed", {
        runId: this.state.get("runId"),

        error: error.message,
      });

      throw error;
    }
  }
}
