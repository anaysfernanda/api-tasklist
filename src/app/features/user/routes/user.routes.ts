import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { CreateUserValidator } from "../validators/create-user.validator";
import { TaskController } from "../../task/controller/task.controller";
import { LoginValidatorMiddleware } from "../../../../middleware/login-validator-middleware";

export const userRoutes2 = () => {
  const router = Router();

  router.post(
    "/",
    CreateUserValidator.validate,
    new UserController().createUser
  );

  return router;
};
