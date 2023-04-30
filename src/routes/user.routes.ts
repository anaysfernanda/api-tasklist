import { Router } from "express";
import { TaskController } from "../app/features/task/controller/task.controller";

export const userRoutes = () => {
  const app = Router();

  // app.post("/", new UserController().createUser);
  // app.get("/", new UserController().list);
  // app.get("/:userId", new UserController().getUser);
  // app.post(
  //   "/login",
  //   LoginValidatorMiddleware.loginValidator,
  //   new UserController().login
  // );
  app.post("/:userId/tasks", new TaskController().create);
  // app.get("/:userId/tasks", new TaskController().list);
  app.delete("/:userId/tasks/:taskId", new TaskController().delete);
  app.put("/:userId/tasks/:taskId", new TaskController().update);

  return app;
};
