import Groq from "groq-sdk";

export class AgentExecutor {
  constructor({
    apiKey = process.env.GROQ_API_KEY,
    model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
  } = {}) {
    this.model = model;
    this.client = apiKey ? new Groq({ apiKey }) : null;
  }

  async decide({ goal, order, policy }) {
    if (!this.client) {
      return {
        action: order.eligible ? "request_refund" : "deny_refund",
        reason: order.eligible
          ? "Fallback decision: order is eligible."
          : "Fallback decision: order is not eligible.",
        confidence: 0.5,
        source: "fallback"
      };
    }

    const prompt = `
You are the decision step in a customer refund workflow.

Return ONLY valid JSON with:
{
  "action": "request_refund" | "deny_refund",
  "reason": "short explanation",
  "confidence": number
}

Rules:
- Request a refund only when order.eligible is true.
- Never approve a refund by yourself; the workflow policy decides whether human approval is required.
- Do not invent order facts.

Goal: ${goal}

Order:
${JSON.stringify(order, null, 2)}

Policy:
${JSON.stringify(policy, null, 2)}
`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are a constrained production workflow decision component."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0,
        max_completion_tokens: 512,
        response_format: { type: "json_object" },
        include_reasoning: false
      });

      const raw = completion.choices?.[0]?.message?.content || "{}";
      const decision = JSON.parse(raw);

      if (!["request_refund", "deny_refund"].includes(decision.action)) {
        throw new Error("INVALID_AGENT_DECISION");
      }

      return {
        ...decision,
        source: "groq"
      };
    } catch (error) {
      error.code = error.code || "GROQ_ERROR";
      error.retryable = true;
      throw error;
    }
  }
}
