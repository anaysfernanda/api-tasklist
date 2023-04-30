import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";

export class GetUserUsecase {
  public async execute(idUser: string): Promise<Return> {
    const cacheRepository = new CacheRepository();

    const cacheResult = await cacheRepository.get(`getUser:${idUser}`);

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Usuário obtido com sucesso! - Cache",
        data: cacheResult,
      };
    }
    const repository = new UserRepository();
    const getUser = await repository.get(idUser);

    if (!getUser) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado!",
      };
    }

    await cacheRepository.set(`getUser:${idUser}`, getUser.toJson());
    return {
      ok: true,
      code: 200,
      message: "Usuário obtido com sucesso!",
      data: getUser.toJson(),
    };
  }
}
