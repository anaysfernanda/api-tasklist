import { Router } from "express";
import { TaskController } from "../controller/task.controller";
import { UserController } from "../controller/user.controller";
import { LoginValidatorMiddleware } from "../middleware/login-validator-middleware";

export const userRoutes = () => {
  const app = Router();

  app.post("/registration", new UserController().createUser);
  app.get("/", new UserController().list);
  app.post(
    "/",
    LoginValidatorMiddleware.loginValidator,
    new UserController().login
  );
  app.post("/:userId/tasks", new TaskController().create);
  app.get("/:userId/tasks", new TaskController().list);
  app.delete("/:userId/tasks/:taskId", new TaskController().delete);
  app.put("/:userId/tasks/:taskId", new TaskController().update);

  return app;
};
