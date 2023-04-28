import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";

export class CreateUserValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      if (email === "" || password === "") {
        return RequestError.fieldNotProvided(res, "Campos");
      }

      if (password.length < 6) {
        return RequestError.fieldNotProvided(res, "Senha");
      }

      next();
    } catch (error: any) {
      ServerError.genericError(res, error);
    }
  }
}
