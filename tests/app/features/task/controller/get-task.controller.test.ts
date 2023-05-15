import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { ListTasksUsecase } from "../../../../../src/app/features/task/usecases/list-tasks.usecase";
import { GetTaskUsecase } from "../../../../../src/app/features/task/usecases/get-task.usecase";

const user = new User("any_email", "any_password");
const task = new Task("title_one", "description_one", false);

const makeUser = async () => {
  const db = TypeormConnection.connection.manager;
  const newUser = db.create(UserEntity, user);
  await db.save(newUser);

  return newUser;
};

describe("List one task controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection.manager.delete(UserEntity, {});
    await TypeormConnection.connection.manager.delete(TaskEntity, {});
  });

  const app = createApp();

  test("Deveria retornar 404 se a task não existir.", async () => {
    const user = await makeUser();
    const res = await request(app)
      .get(`/user/${user.id}/tasks/:taskId}`)
      .send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Task não encontrada!");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 200 e uma task. ", async () => {
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");
    const db = TypeormConnection.connection.manager;

    const newUser = db.create(UserEntity, user);
    await db.save(newUser);

    const newTask = db.create(TaskEntity, {
      title: task.title,
      description: task.description,
      archived: task.archived,
      user: {
        id: newUser.id,
      },
    });
    await db.save(newTask);

    const res = await request(app)
      .get(`/user/${newUser.id}/tasks/${newTask.id}`)
      .send()
      .expect(200);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.message).toEqual("Task listada com sucesso!");
    expect(cacheSpyOn).toHaveBeenCalledWith(
      `getTask:${newTask.id}`,
      res.body.data,
      3600
    );
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });

  test("Deveria retornar erro 500 se gerar uma exceção.", async () => {
    jest
      .spyOn(GetTaskUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado");
      });
    const res = await request(app)
      .get(`/user/:userId/tasks/:taskId`)
      .send()
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  });
});
