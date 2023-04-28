import { Request, Response } from "express";
import { UserRepository } from "../database/user.repository";
import { RequestError } from "../../../shared/errors/request.error";
import { ServerError } from "../../../shared/errors/server.error";
import { SuccessResponse } from "../../../shared/util/success.response";
import { User } from "../../../models/user.model";
import { CreateUserUsecase } from "../usecases/create-user.usecase";

export class UserController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const database = new UserRepository();

      if (!email) {
        return RequestError.notFound(res, "E-mail");
      }

      if (!password) {
        return RequestError.notFound(res, "Senha");
      }

      const user = {
        email,
        password,
      };

      const result = await database.login(user);

      const userId = {
        id: result.id,
      };

      if (!userId) {
        return res.status(401).send({
          ok: false,
          message: "Usuário não autorizado.",
        });
      }

      return SuccessResponse.ok(res, "Usuário encontrado com sucesso.", userId);
    } catch (error: any) {
      return ServerError.genericError(res, "Usuário não encontrado!");
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
      const database = new UserRepository();
      const userList = await database.list();

      const list = userList.map((user) => user.toJson());

      return SuccessResponse.ok(res, "Usuário listado com sucesso.", list);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const database = new UserRepository();
      const user = await database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      return SuccessResponse.ok(
        res,
        "Usuário listado com sucesso.",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
