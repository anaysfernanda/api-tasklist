import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CreateTaskUsecase } from "../../../../../src/app/features/task/usecases/create-task.usecase";
import { Task } from "../../../../../src/app/models/task.model";
import { User } from "../../../../../src/app/models/user.model";
import { UpdateTaskUsecase } from "../../../../../src/app/features/task/usecases/update-task.usecase";

const user = new User("any_email", "any_password");
const task = new Task("title_one", "description_one", false);

const makeUser = async () => {
  const db = TypeormConnection.connection.manager;
  const newUser = db.create(UserEntity, user);
  await db.save(newUser);

  return newUser;
};

describe("Update task controller tests", () => {
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
    await RedisConnection.connection.del(`getTask:${user.id}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${true}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${false}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${undefined}`);
    await TypeormConnection.connection.manager.delete(UserEntity, {});
    await TypeormConnection.connection.manager.delete(TaskEntity, {});
  });

  const app = createApp();
  test("Deveria retornar status 404 se o usuário não existir.", async () => {
    const res = await request(app).put("/user/:userId/tasks/:taskId").send({});

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Usuário não encontrado!");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 404 se a task não existir.", async () => {
    const user = await makeUser();
    const res = await request(app)
      .put(`/user/${user.id}/tasks/:taskId}`)
      .send({});

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Task não encontrada!");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 200 se a task for editada.", async () => {
    const user = await makeUser();

    const db = TypeormConnection.connection.manager;

    const newTask = db.create(TaskEntity, {
      title: task.title,
      description: task.description,
      archived: task.archived,
      user: {
        id: user.id,
      },
    });
    await db.save(newTask);

    const res = await request(app)
      .put(`/user/${user.id}/tasks/${newTask.id}`)
      .send({
        title: "new_title",
        description: "new_description",
        archived: true,
      })
      .expect(200);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.message).toEqual("Task editada com sucesso!");
  });

  test("Deveria retornar erro 500 se gerar uma exceção.", async () => {
    jest
      .spyOn(UpdateTaskUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado");
      });
    const res = await request(app)
      .put(`/user/:userId/tasks/:taskId`)
      .send({ title: task.title, description: task.description })
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
    expect(res.ok).toBeFalsy();
  });
});
