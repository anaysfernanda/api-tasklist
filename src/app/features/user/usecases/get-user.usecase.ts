import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";

export class GetUserUsecase {
  public async execute(idUser: string): Promise<Return> {
    const repository = new UserRepository();
    const getUser = await repository.get(idUser);

    if (!getUser) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado!",
      };
    }

    return {
      ok: true,
      code: 200,
      message: "Usuário obtido com sucesso!",
      data: getUser.toJson(),
    };
  }
}
