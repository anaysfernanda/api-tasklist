import cors from "cors";
import express from "express";
import { userRoutes } from "../../routes/user.routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/user", userRoutes());

  return app;
};
