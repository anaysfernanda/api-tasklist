import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../../user/database/user.repository";

export class CreateTaskValidator {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description } = req.body;

      if (title === "") {
        return RequestError.fieldNotProvided(res, "Título");
      }

      if (description === "") {
        return RequestError.fieldNotProvided(res, "Descrição");
      }

      next();
    } catch (error: any) {
      ServerError.genericError(res, error);
    }
  }
}
