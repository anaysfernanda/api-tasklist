import { NextFunction, Request, Response } from "express";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../database/user.repository";
import { ServerError } from "../../../shared/errors/server.error";

export class LoginValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return RequestError.notFound(res, "E-mail");
      }

      if (!password) {
        return RequestError.notFound(res, "Senha");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, "E-mail e/ou senha incorreta!");
    }
  }
}
