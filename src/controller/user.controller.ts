import { Request, Response } from "express";
import { UserDataBase } from "../database/user.database";
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

  public createUser(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const dataBase = new UserDataBase();
      const userList = new UserDataBase().list();

      if (email === "" || password === "" || name === "") {
        return res.status(404).send({
          ok: false,
          message: "Preencha todos os campos!",
        });
      }

      if (password.length < 6) {
        return res.status(404).send({
          ok: false,
          message: "Preencha a senha com pelo menos 5 caractéres.",
        });
      }

      const userExist = userList.some((user) => user.email === email);
      if (userExist) {
        return res.status(404).send({
          ok: false,
          message: "Usuário já cadastrado. Volte e faça o login.",
        });
      }
      const newUser = new User(name, email, password);

      dataBase.create(newUser);

      return SuccessResponse.created(
        res,
        "O usuário foi criado com sucesso",
        newUser.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public list(req: Request, res: Response) {
    try {
      const userList = new UserDataBase().list();

      return SuccessResponse.ok(res, "Usuário listado com sucesso.", userList);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
