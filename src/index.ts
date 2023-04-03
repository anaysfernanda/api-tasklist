import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";
import { DatabaseConnection } from "./database/config/database.connection";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRoutes());

DatabaseConnection.connect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`API está rodando na porta ${process.env.PORT}`);
  });
});
