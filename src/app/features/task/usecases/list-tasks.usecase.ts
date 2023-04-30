import { Return } from "../../../shared/util/return.contract";
import { TaskRepository } from "../database/task.repository";

export class ListTasksUsecase {
  public async execute(userId: string): Promise<Return> {
    const database = new TaskRepository();
    let list = await database.list(userId);
    let result = list.map((task) => task.toJson());
    return {
      ok: true,
      code: 200,
      message: "Usuários listados com sucesso!",
      data: result,
    };
  }
}
