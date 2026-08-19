import helmet from "helmet";

export function securityMiddleware(app) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
}
