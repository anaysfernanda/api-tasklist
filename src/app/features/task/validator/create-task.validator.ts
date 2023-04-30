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
      const { userId } = req.params;
      const { title, description } = req.body;

      const database = new UserRepository();
      const user = await database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "Usuário");
      }
      if (title === "" || description === "") {
        return RequestError.fieldNotProvided(res, "Campo");
      }

      next();
    } catch (error: any) {
      ServerError.genericError(res, error);
    }
  }
}
