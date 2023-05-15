import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { TaskRepository } from "../database/task.repository";

export class ListTasksUsecase {
  public async execute(userId: string, archived: any): Promise<Return> {
    const user = await new UserRepository().get(userId);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado!",
      };
    }

    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(
      `listaTasks:${userId}-${archived}`
    );

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Tasks listadas com sucesso! - Cache",
        data: cacheResult,
      };
    }

    const database = new TaskRepository();
    let list = await database.list(userId, archived);
    let result = list.map((task) => task.toJson());

    await cacheRepository.setEx(
      `listaTasks:${userId}-${archived}`,
      result,
      3600
    );

    return {
      ok: true,
      code: 200,
      message: "Tasks listadas com sucesso!",
      data: result,
    };
  }
}
