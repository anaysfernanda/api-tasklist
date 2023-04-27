import { Request, Response } from "express";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { ServerError } from "../error/server.error";
import { RequestError } from "../error/request.error";
import { UserDataBase } from "../app/features/user/database/user.database";
import { SuccessResponse } from "../util/success.response";
import { TaskDatabase } from "../app/features/task/database/task.database";
import { error } from "console";

export class TaskController {
  public async list(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const database = new TaskDatabase();
      let list = await database.list(userId);
      let result = list.map((task) => task.toJson());

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }

      return SuccessResponse.ok(res, "Lista de tasks.", result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, description, archived } = req.body;

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }

      const database = new UserDataBase();
      const user = await database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }
      if (title === "" || description === "") {
        return RequestError.fieldNotProvided(res, "Campo");
      }
      const newTask = new Task(title, description, archived);
      const task = await new TaskDatabase().create(userId, newTask);

      const result = {};
      return SuccessResponse.created(
        res,
        "Task criada com sucesso!",
        task.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const { title, description, archived } = req.body;
      const user = new UserDataBase().get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }
      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Id da Task");
      }
      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const database = new TaskDatabase();
      const result = await database.update(
        taskId,
        title,
        description,
        archived
      );

      if (!result) {
        return RequestError.notFound(res, "Task");
      }

      return SuccessResponse.created(res, "Task editada com sucesso!", result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const user = await new UserDataBase().get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Usuário");
      }
      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Task");
      }
      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const database = new TaskDatabase();
      const result = await database.delete(taskId);

      if (result === 0) {
        return RequestError.notFound(res, "Task");
      }

      return SuccessResponse.created(res, "Task deletada com sucesso!", taskId);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
