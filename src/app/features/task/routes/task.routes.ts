import { Router } from "express";
import { TaskController } from "../../task/controller/task.controller";

export const taskRoutes = () => {
  const router = Router();
  router.get("/:userId/tasks", new TaskController().list);

  return router;
};
