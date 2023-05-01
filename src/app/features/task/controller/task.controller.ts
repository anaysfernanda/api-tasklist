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
import { UpdateTaskUsecase } from "../usecases/update-task.usecase";
import { DeleteTaskUsecase } from "../usecases/delete-task.usecase";
import { GetTaskUsecase } from "../usecases/get-task.usecase";

export class TaskController {
  public async list(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { archived } = req.query;
      const result = await new ListTasksUsecase().execute(userId, archived);

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
      const result = await new UpdateTaskUsecase().execute({
        userId,
        taskId,
        title,
        description,
        archived,
      });
      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const result = await new DeleteTaskUsecase().execute({ userId, taskId });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { userId, taskId } = req.params;
      const result = await new GetTaskUsecase().execute({ userId, taskId });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
