import { Router } from "express";
import { TaskController } from "../../task/controller/task.controller";
import { CreateTaskValidator } from "../validator/create-task.validator";

export const taskRoutes = () => {
  const router = Router();
  router.get("/:userId/tasks", new TaskController().list);
  router.get("/:userId/tasks/:taskId", new TaskController().get);
  router.post(
    "/:userId/tasks",
    CreateTaskValidator.validate,
    new TaskController().create
  );
  router.put("/:userId/tasks/:taskId", new TaskController().update);
  router.delete("/:userId/tasks/:taskId", new TaskController().delete);

  return router;
};
