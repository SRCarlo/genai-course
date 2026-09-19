import { Router } from "express";

export function createChatRoutes(controller, auth) {
  const router = Router();

  router.use(auth);
  router.post("/", controller.chat);

  return router;
}
