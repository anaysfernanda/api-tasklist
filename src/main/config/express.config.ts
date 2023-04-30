import cors from "cors";
import express from "express";
// import { userRoutes } from "../../routes/user.routes";
import { userRoutes2 } from "../../app/features/user/routes/user.routes";
import { userRoutes } from "../../routes/user.routes";
import { taskRoutes } from "../../app/features/task/routes/task.routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/user", userRoutes());
  app.use("/user", userRoutes2());
  app.use("/task", taskRoutes());

  return app;
};
