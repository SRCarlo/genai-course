import { BaseProvider } from "./base-provider.js";

export class ProviderA extends BaseProvider {
  constructor({
    apiKey,
    model,
    timeoutMs,
    simulateFailure = false,
    failureRate = 0.3,
    fetchImpl = fetch,
  } = {}) {
    super("groq-primary");
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
    this.simulateFailure = simulateFailure;
    this.failureRate = failureRate;
    this.fetchImpl = fetchImpl;
  }

  async generate(request) {
    if (!this.apiKey) throw new Error("GROQ_API_KEY is not configured");
    if (this.simulateFailure && Math.random() < this.failureRate)
      throw new Error("Simulated provider failure");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const messages = [];
      if (request.systemPrompt)
        messages.push({ role: "system", content: request.systemPrompt });
      messages.push({ role: "user", content: request.prompt });
      const response = await this.fetchImpl(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: request.model || this.model,
            messages,
            ...(request.temperature === undefined
              ? {}
              : { temperature: request.temperature }),
          }),
          signal: controller.signal,
        },
      );
      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }
      if (!response.ok) {
        const error = new Error(
          data?.error?.message || `Groq API error (${response.status})`,
        );
        error.status = response.status;
        throw error;
      }
      const usage = data.usage || {};
      return {
        provider: this.name,
        model: data.model || request.model || this.model,
        text: data.choices?.[0]?.message?.content || "",
        usage: {
          inputTokens: usage.prompt_tokens || 0,
          outputTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0,
        },
        requestId: data.id || null,
      };
    } catch (error) {
      if (error.name === "AbortError") {
        const timeoutError = new Error("Groq request timed out");
        timeoutError.code = "ETIMEDOUT";
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
