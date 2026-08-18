import { validateInput } from "../security/inputValidator.js";
import {
  detectPromptInjection,
  protectSystemPromptRequest,
} from "../security/promptGuard.js";
import {
  createRequestId,
  createTraceId,
  logSecurityEvent,
} from "../security/securityLogger.js";

export function securityMiddleware(req, res, next) {
  const requestId = createRequestId();
  const traceId = createTraceId();

  req.requestId = requestId;
  req.traceId = traceId;

  const question = req.body?.question;

  const input = validateInput(question);

  if (!input.valid) {
    logSecurityEvent(
      "security.input_blocked",
      {
        requestId,
        traceId,
        reason: input.reason,
      },
      "warn",
    );

    return res.status(400).json({
      error: input.reason,
    });
  }

  const injection = detectPromptInjection(input.value);

  if (injection.suspicious) {
    logSecurityEvent(
      "security.suspicious_prompt",
      {
        requestId,
        traceId,
        reason: injection.reason,
      },
      "warn",
    );

    return res.status(400).json({
      error: "Suspicious prompt detected",
    });
  }

  if (protectSystemPromptRequest(input.value)) {
    logSecurityEvent(
      "security.system_prompt_blocked",
      {
        requestId,
        traceId,
      },
      "warn",
    );

    return res.status(403).json({
      error: "Internal system instructions cannot be provided.",
    });
  }

  req.safeQuestion = input.value;

  next();
}
