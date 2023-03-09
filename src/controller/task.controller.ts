import { Request, Response } from "express";
import { users } from "../database/users";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { ServerError } from "../error/server.error";
import { RequestError } from "../error/request.error";
import { UserDataBase } from "../database/user.database";
import { SuccessResponse } from "../util/success.response";

export class TaskController {
  public list(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { archived } = req.query;

      const database = new UserDataBase();
      const user = database.getById(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      let allTasks = user.tasks;

      if (archived !== undefined) {
        allTasks = allTasks.filter((task) => task.archived === true);
      } else {
        allTasks = allTasks.filter((task) => task.archived === false);
      }
      return SuccessResponse.ok(res, "Lista de tasks.", allTasks);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, description, archived } = req.body;

      const database = new UserDataBase();
      const user = database.getById(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      if (title === "" || description === "") {
        return RequestError.fieldNotProvided(res, "Campo");
      }

      const newTask = new Task(title, description, archived);
      user.addTask(newTask);

      return SuccessResponse.created(res, "Task criada com sucesso!", newTask);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const { title, description, archived } = req.body;

      const database = new UserDataBase();
      const user = database.getById(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }

      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Id da Task");
      }

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const listaDeTasks = user.tasks;
      let task = listaDeTasks.find((task) => task.id === taskId);

      if (!task) {
        return RequestError.notFound(res, "Task");
      }

      if (title) {
        task.title = title;
      }

      if (description) {
        task.description = description;
      }

      if (archived) {
        task.archived = archived;
      }

      return SuccessResponse.created(res, "Task editada com sucesso!", task);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;

      const database = new UserDataBase();
      const user = database.getById(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Usuário");
      }

      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Task");
      }

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const listaDeTasks = user.tasks;

      const taskIndex = listaDeTasks.findIndex((task) => task.id === taskId);

      if (taskIndex < 0) {
        return RequestError.notFound(res, "task");
      }
      const taskDeleted = listaDeTasks.splice(taskIndex, 1);

      return SuccessResponse.created(
        res,
        "Task deletada com sucesso!",
        taskDeleted
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
