import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";

export class ListUserUsecase {
  public async execute(): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get("userList");

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Usuários listados com sucesso! - Cache",
        data: cacheResult,
      };
    }
    const database = new UserRepository();

    let user = await database.list();
    const result = user.map((user) => user.toJson());
    await cacheRepository.set(`userList`, result);

    return {
      ok: true,
      code: 200,
      message: "Usuários listados com sucesso!",
      data: result,
    };
  }
}
