import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { TaskRepository } from "../database/task.repository";

export class GetTaskUsecase {
  public async execute(taskId: string): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(`getTask:${taskId}`);

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Task listada com sucesso! - Cache",
        data: cacheResult,
      };
    }

    const database = new TaskRepository();
    let task = await database.get(taskId);

    if (task === 0) {
      return {
        ok: false,
        code: 404,
        message: "Task não encontrada!",
      };
    }

    await cacheRepository.setEx(`getTask:${taskId}`, task, 3600);

    return {
      ok: true,
      code: 200,
      message: "Task listada com sucesso!",
      data: task,
    };
  }
}
