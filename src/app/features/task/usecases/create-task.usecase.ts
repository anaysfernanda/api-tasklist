import { Task } from "../../../models/task.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/util/return.contract";
import { TaskRepository } from "../database/task.repository";

interface CreateTaskParams {
  userId: string;
  title: string;
  description: string;
  archived: boolean;
}

export class CreateTaskUsecase {
  public async execute(data: CreateTaskParams): Promise<Return> {
    const newTask = new Task(data.title, data.description, data.archived);
    const task = await new TaskRepository().create(data.userId, newTask);

    await new CacheRepository().delete(`listaTasks`);

    return {
      ok: true,
      code: 201,
      message: "Task criada com sucesso!",
      data: task.toJson(),
    };
  }
}
