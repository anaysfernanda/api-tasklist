import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { TaskRepository } from "../database/task.repository";

export class ListTasksUsecase {
  public async execute(userId: string): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get("listaTasks");

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Tasks listadas com sucesso! - Cache",
        data: cacheResult,
      };
    }

    const database = new TaskRepository();
    let list = await database.list(userId);
    let result = list.map((task) => task.toJson());

    await cacheRepository.set(`listaTasks`, result);

    return {
      ok: true,
      code: 200,
      message: "Tasks listadas com sucesso!",
      data: result,
    };
  }
}
