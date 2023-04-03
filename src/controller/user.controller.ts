import { Request, Response } from "express";
import { UserDataBase } from "../database/repositories/user.database";
import { RequestError } from "../error/request.error";
import { ServerError } from "../error/server.error";
import { SuccessResponse } from "../util/success.response";
import { User } from "../models/user.model";

export class UserController {
  public login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const database = new UserDataBase();
      const user = database.login(String(email), String(password));

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }

      return SuccessResponse.ok(
        res,
        "Usuário encontrado com sucesso.",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = new User(email, password);

      const dataBase = new UserDataBase();
      const userList = await dataBase.list();

      // if (email === "" || password === "") {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "Preencha todos os campos!",
      //   });
      // }

      // if (password.length < 6) {
      //   return res.status(404).send({
      //     ok: false,
      //     message: "Preencha a senha com pelo menos 5 caractéres.",
      //   });
      // }

      const userExist = userList.some((user) => user.email === email);
      if (userExist) {
        return res.status(404).send({
          ok: false,
          message: "Usuário já cadastrado. Volte e faça o login.",
        });
      }

      return SuccessResponse.created(
        res,
        "O usuário foi criado com sucesso",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const database = new UserDataBase();
      const userList = await database.list();
      console.log("userList", userList);
      const list = userList.map((user) => user.toJson());

      return SuccessResponse.ok(res, "Usuário listado com sucesso.", list);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
