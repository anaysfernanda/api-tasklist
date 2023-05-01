const parseArchived = (archived?: any) => {
  if (!archived) {
    return undefined;
  }

  if (archived !== "false" && archived !== "true") {
    throw new Error("Parâmetro inválido");
  }

  return archived !== "false";
};

import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";

export class FilterTaskValidator {
  public static async validate(req: any, res: Response, next: NextFunction) {
    try {
      const { archived } = req.query;

      const archivedBoolean = parseArchived(archived);
      req.query.archived = archivedBoolean;
      next();
    } catch (error: any) {
      ServerError.genericError(res, error);
    }
  }
}
