import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { TaskRepository } from "../database/task.repository";

interface DeleteTaskParams {
  userId: string;
  taskId: string;
}

export class DeleteTaskUsecase {
  public async execute(data: DeleteTaskParams): Promise<Return> {
    const user = new UserRepository().get(data.userId);

    const database = new TaskRepository();
    const result = await database.delete(data.taskId);

    if (result === 0) {
      return {
        ok: false,
        code: 404,
        message: "Task não encontrada!",
      };
    }

    return {
      ok: true,
      code: 200,
      message: "Task excluida com sucesso!",
      data: data.taskId,
    };
  }
}
