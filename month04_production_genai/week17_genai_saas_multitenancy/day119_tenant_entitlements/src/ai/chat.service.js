export class ChatService {
  constructor({ entitlementService, usageService, llm, clock = () => new Date() }) {
    this.entitlementService = entitlementService;
    this.usageService = usageService;
    this.llm = llm;
    this.clock = clock;
  }

  async chat({ tenantId, question }) {
    if (typeof question !== "string" || !question.trim()) {
      throw new Error("QUESTION_REQUIRED");
    }
    if (question.length > 12_000) {
      throw new Error("QUESTION_TOO_LONG");
    }

    const entitlements = await this.entitlementService.requireFeature(tenantId, "basicChat");
    const period = this.clock().toISOString().slice(0, 7);

    // Conservative rough estimate. Provider-reported usage is reconciled afterward.
    const estimatedTokens = Math.max(1, Math.ceil(question.length / 4) + 256);
    const reservationId = await this.usageService.reserve({
      tenantId,
      period,
      estimatedTokens,
      limits: entitlements.limits
    });

    try {
      const result = await this.llm.generate({ question: question.trim() });
      const inputTokens = result.usage?.inputTokens ?? 0;
      const outputTokens = result.usage?.outputTokens ?? 0;
      const totalTokens = inputTokens + outputTokens;

      await this.usageService.reconcile({ reservationId, actualTokens: totalTokens });

      return {
        answer: result.answer,
        usage: { inputTokens, outputTokens, totalTokens, period }
      };
    } catch (error) {
      // If reconciliation already succeeded, release will fail; preserve the original error.
      try {
        await this.usageService.release({ reservationId });
      } catch {
        // Reservation may already have been settled.
      }
      throw error;
    }
  }
}
