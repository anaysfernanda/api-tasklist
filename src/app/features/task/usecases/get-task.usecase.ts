import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { TaskRepository } from "../database/task.repository";

interface GetTaskParams {
  userId: string;
  taskId: string;
}

export class GetTaskUsecase {
  public async execute(data: GetTaskParams): Promise<Return> {
    const user = new UserRepository().get(data.userId);

    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(`getTask${data.taskId}`);

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Task listada com sucesso! - Cache",
        data: cacheResult,
      };
    }

    const database = new TaskRepository();
    let task = await database.get(data.taskId);

    await cacheRepository.set(`getTask${data.taskId}`, task);

    return {
      ok: true,
      code: 200,
      message: "Task listada com sucesso!",
      data: task,
    };
  }
}
