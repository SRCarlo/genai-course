import { trace, SpanStatusCode } from "@opentelemetry/api";

export const tracer = trace.getTracer("genai-saas-capstone", "1.0.0");
export { SpanStatusCode };
