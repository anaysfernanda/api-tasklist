import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { CreateUserValidator } from "../validators/create-user.validator";
import { TaskController } from "../../task/controller/task.controller";
import { LoginValidator } from "../validators/login-user.validator";

export const userRoutes2 = () => {
  const router = Router();

  router.post(
    "/",
    CreateUserValidator.validate,
    new UserController().createUser
  );
  router.get("/", new UserController().list);
  router.get("/:userId", new UserController().getUser);
  router.post("/login", LoginValidator.validate, new UserController().login);

  return router;
};
