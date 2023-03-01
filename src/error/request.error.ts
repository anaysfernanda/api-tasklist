import { Response } from "express";

export class RequestError {
  public static fieldNotProvided(res: Response, field: string) {
    return res.status(400).send({
      ok: false,
      message: field + " não fornecido.",
    });
  }

  public static notFound(res: Response, entity: string) {
    return res.status(404).send({
      ok: false,
      message: entity + " não encontrado.",
    });
  }
}
