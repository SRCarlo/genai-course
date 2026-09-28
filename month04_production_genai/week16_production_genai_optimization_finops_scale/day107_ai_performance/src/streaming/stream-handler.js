import { randomUUID } from "node:crypto";
import { streamText } from "../llm/groq-client.js";
import { startTimer, elapsedMs } from "../performance/timer.js";

export function setupSSE(res) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
}

function sendEvent(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function streamGroqResponse({ req, res, messages, maxCompletionTokens = 512 }) {
  const requestId = randomUUID();
  const start = startTimer();
  let ttftMs = null;
  let tokenCount = 0;
  let closed = false;

  const onClose = () => {
    closed = true;
  };

  req.on("close", onClose);

  try {
    const stream = await streamText({ messages, maxCompletionTokens });

    for await (const chunk of stream) {
      if (closed) break;

      const token = chunk.choices?.[0]?.delta?.content || "";
      if (!token) continue;

      tokenCount++;
      if (ttftMs === null) {
        ttftMs = elapsedMs(start);
        sendEvent(res, {
          type: "meta",
          requestId,
          ttftMs: Number(ttftMs.toFixed(2))
        });
      }

      sendEvent(res, { type: "token", token });
    }

    const ttltMs = elapsedMs(start);

    if (!closed) {
      sendEvent(res, {
        type: "done",
        requestId,
        ttftMs: ttftMs === null ? null : Number(ttftMs.toFixed(2)),
        ttltMs: Number(ttltMs.toFixed(2)),
        tokenCount
      });
      res.end();
    }

    return { requestId, ttftMs, ttltMs, tokenCount };
  } catch (error) {
    if (!closed) {
      sendEvent(res, {
        type: "error",
        requestId,
        message: error.message
      });
      res.end();
    }
    throw error;
  } finally {
    req.off("close", onClose);
  }
}
