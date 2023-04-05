import { Task } from "../../models/task.model";
import { DatabaseConnection } from "../config/database.connection";
import { TaskEntity } from "../entities/task.entity";

export class TaskDatabase {
  private repository = DatabaseConnection.connection.getRepository(TaskEntity);

  public async list(id: string) {
    const result = await this.repository.find({
      where: {
        user: {
          id,
        },
      },
    });

    return result.map((task) => TaskDatabase.mapEntityModel(task));
  }

  public static mapEntityModel(entity: TaskEntity): Task {
    return Task.create(
      entity.id,
      entity.title,
      entity.description,
      entity.archived
    );
  }

  public async create(id: string, task: Task) {
    const taskEntity = this.repository.create({
      id: task.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
      user: {
        id: id,
      },
    });

    const result = await this.repository.save(taskEntity);
    return TaskDatabase.mapEntityModel(result);
  }

  public async get(id: string) {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      return 0;
    }

    return result;
  }

  public async update(
    id: string,
    title: string,
    description: string,
    archived: boolean
  ): Promise<any> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        title,
        description,
        archived,
        drhrAtualizacao: new Date(),
      }
    );

    if (result.affected === 1) {
      return {
        id,
        title,
        description,
        archived,
      };
    }

    return null;
  }

  public async delete(id: string): Promise<number> {
    const result = await this.repository.delete({
      id,
    });

    return result.affected ?? 0;
  }
}
