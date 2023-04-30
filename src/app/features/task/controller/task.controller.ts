import { Request, Response } from "express";
import { Task } from "../../../models/task.model";
import { User } from "../../../models/user.model";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../../user/database/user.repository";
import { SuccessResponse } from "../../../shared/util/success.response";
import { TaskRepository } from "../database/task.repository";
import { error } from "console";
import { ListTasksUsecase } from "../usecases/list-tasks.usecase";
import { CreateTaskUsecase } from "../usecases/create-task.usecase";

export class TaskController {
  public async list(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await new ListTasksUsecase().execute(userId);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, description, archived } = req.body;

      const result = await new CreateTaskUsecase().execute({
        userId,
        title,
        description,
        archived,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const { title, description, archived } = req.body;
      const user = new UserRepository().get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Id do usuário");
      }
      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Id da Task");
      }
      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const database = new TaskRepository();
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
      const user = await new UserRepository().get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "Usuário");
      }
      if (!taskId) {
        return RequestError.fieldNotProvided(res, "Task");
      }
      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      const database = new TaskRepository();
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
