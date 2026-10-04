import crypto from "node:crypto";

export class TenantCache {
  constructor() {
    this.cache = new Map();
  }

  createKey({ tenantId, model, prompt, knowledgeVersion = "v1" }) {
    const payload = JSON.stringify({
      tenantId,
      model,
      prompt,
      knowledgeVersion
    });

    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  get(context) {
    return this.cache.get(this.createKey(context));
  }

  set(context, value) {
    this.cache.set(this.createKey(context), value);
  }

  has(context) {
    return this.cache.has(this.createKey(context));
  }
}