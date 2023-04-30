import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { TaskRepository } from "../database/task.repository";

interface UpdateTaskParams {
  userId: string;
  taskId: string;
  title: string;
  description: string;
  archived: boolean;
}

export class UpdateTaskUsecase {
  public async execute(data: UpdateTaskParams): Promise<Return> {
    const user = new UserRepository().get(data.userId);

    const database = new TaskRepository();
    const result = await database.update(
      data.taskId,
      data.title,
      data.description,
      data.archived
    );

    if (!result) {
      return {
        ok: false,
        code: 404,
        message: "Task não encontrada!",
      };
    }

    await new CacheRepository().delete(`listaTasks`);
    await new CacheRepository().delete(`getTask${data.taskId}`);

    return {
      ok: true,
      code: 200,
      message: "Task editada com sucesso!",
      data: result,
    };
  }
}
