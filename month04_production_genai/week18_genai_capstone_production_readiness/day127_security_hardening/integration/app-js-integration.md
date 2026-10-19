# Integrate into existing `src/app.js`

Do not replace the existing file. Preserve routes, JSON parsing, tenant authorization, not-found handler, and error handler.

Add these imports if missing:
```js
import pinoHttp from "pino-http";
import { logger } from "./observability/logger.js";
import { requestContext } from "./observability/request-context.js";
```

After `export const app = express();`, before body parsing and routes, add:
```js
app.use(requestContext);

app.use(pinoHttp({
  logger,
  customProps: (req) => ({ requestId: req.requestId }),
  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return { method: req.method, url: req.url, requestId: req.requestId };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
}));
```

If pino-http is already configured, merge options instead of registering it twice.

Add these before the not-found/catch-all handler:
```js
app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "alive" });
});

app.get("/health/ready", async (_req, res) => {
  // Placeholder only; add real dependency checks when needed.
  res.status(200).json({ status: "ready" });
});
```

The readiness example does not check external dependencies yet.
