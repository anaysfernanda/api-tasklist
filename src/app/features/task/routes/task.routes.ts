import { Router } from "express";
import { TaskController } from "../../task/controller/task.controller";
import { CreateTaskValidator } from "../validator/create-task.validator";

export const taskRoutes = () => {
  const router = Router();
  router.get("/:userId/tasks", new TaskController().list);
  router.post(
    "/:userId/tasks",
    CreateTaskValidator.validate,
    new TaskController().create
  );

  return router;
};
