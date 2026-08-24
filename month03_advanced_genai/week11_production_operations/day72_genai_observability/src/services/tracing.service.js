import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("day72-genai-observability", "1.0.0");

export async function withSpan(name, attributes, operation) {
  return tracer.startActiveSpan(
    name,
    {
      attributes,
    },
    async (span) => {
      try {
        const result = await operation(span);

        span.setStatus({
          code: SpanStatusCode.OK,
        });

        return result;
      } catch (error) {
        span.recordException(error);

        span.setStatus({
          code: SpanStatusCode.ERROR,

          message: error.message,
        });

        throw error;
      } finally {
        span.end();
      }
    },
  );
}

export function getTracer() {
  return tracer;
}
