import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";

export class ListUserUsecase {
  public async execute(): Promise<Return> {
    const database = new UserRepository();

    let user = await database.list();
    const result = user.map((user) => user.toJson());

    return {
      ok: true,
      code: 200,
      message: "Usuários listados com sucesso!",
      data: result,
    };
  }
}
