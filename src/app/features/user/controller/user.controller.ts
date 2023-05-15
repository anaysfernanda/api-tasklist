import { Request, Response } from "express";
import { UserRepository } from "../database/user.repository";
import { RequestError } from "../../../shared/errors/request.error";
import { ServerError } from "../../../shared/errors/server.error";
import { SuccessResponse } from "../../../shared/util/success.response";
import { User } from "../../../models/user.model";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { GetUserUsecase } from "../usecases/get-user.usecase";
import { LoginUsecase } from "../usecases/login-user.usecase";

export class UserController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await new LoginUsecase().execute(req.body);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await new CreateUserUsecase().execute(req.body);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const result = await new ListUserUsecase().execute();

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const result = await new GetUserUsecase().execute(userId);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
