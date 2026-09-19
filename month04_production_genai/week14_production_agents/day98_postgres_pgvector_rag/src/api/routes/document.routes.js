import { Router } from "express";

export function createDocumentRoutes(controller, auth) {
  const router = Router();

  router.use(auth);
  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.delete("/:id", controller.remove);

  return router;
}
