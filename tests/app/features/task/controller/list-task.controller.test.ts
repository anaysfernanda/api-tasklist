import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { ListTasksUsecase } from "../../../../../src/app/features/task/usecases/list-tasks.usecase";

const user = new User("any_email", "any_password");
const task = new Task("title_one", "description_one", false);

describe("List tasks controller tests", () => {
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

  test("Deveria retornar status 404 se o usuário não existir.", async () => {
    const res = await request(app).get("/user/:userId/tasks").send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Usuário não encontrado!");
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 500 se o parâmetro da task for passada errada.", async () => {
    const res = await request(app)
      .get("/user/:userId/tasks")
      .query({ archived: "error" })
      .send()
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Parâmetro inválido");
  });

  test("Deveria retornar status 200 e uma lista de tasks. ", async () => {
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");
    const db = TypeormConnection.connection.manager;

    const userDatabase = TypeormConnection.connection.getRepository(UserEntity);
    const taskDatabase = TypeormConnection.connection.getRepository(TaskEntity);

    const newUser = db.create(UserEntity, user);
    await db.save(newUser);

    const taskOne = db.create(TaskEntity, {
      title: task.title,
      description: task.description,
      archived: task.archived,
      user: {
        id: newUser.id,
      },
    });
    await db.save(taskOne);

    const taskTwo = db.create(TaskEntity, {
      title: task.title,
      description: task.description,
      archived: task.archived,
      user: {
        id: newUser.id,
      },
    });
    await db.save(taskTwo);

    const res = await request(app)
      .get(`/user/${newUser.id}/tasks`)
      .query({ archived: "false" })
      .send()
      .expect(200);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.message).toEqual("Tasks listadas com sucesso!");
    expect(res.body.data).toHaveLength(2);
    expect(cacheSpyOn).toHaveBeenCalledWith(
      `listaTasks:${user.id}-${task.archived}`,
      res.body.data,
      3600
    );
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });

  test("Deveria retornar erro 500 se gerar uma exceção.", async () => {
    jest
      .spyOn(ListTasksUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado");
      });
    const res = await request(app)
      .get(`/user/:userId/tasks`)
      .query({ archived: "false" })
      .send()
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  });
});
