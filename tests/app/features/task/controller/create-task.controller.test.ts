import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { CreateTaskUsecase } from "../../../../../src/app/features/task/usecases/create-task.usecase";
import { Task } from "../../../../../src/app/models/task.model";
import { User } from "../../../../../src/app/models/user.model";

const user = new User("any_email", "any_password");
const task = new Task("title_one", "description_one", false);

describe("Create task controller tests", () => {
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

  const checkFieldNotProvided = (res: any, field: string) => {
    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty("body.message", `${field} não fornecido(a).`);
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  };

  test("Deveria retornar status 404 se o usuário não existir.", async () => {
    const res = await request(app)
      .post("/user/:userId/tasks")
      .send({ title: task.title, description: task.description });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Usuário não encontrado!");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 400 se o título não for informado.", async () => {
    const res = await request(app)
      .post("/user/:userId/tasks")
      .send({ title: "", description: task.description });

    checkFieldNotProvided(res, "Título");
  });

  test("Deveria retornar status 400 se o título não for informado.", async () => {
    const res = await request(app)
      .post("/user/:userId/tasks")
      .send({ title: task.title, description: "" });

    checkFieldNotProvided(res, "Descrição");
  });

  test("Deveria retornar status 201 se a task for criada.", async () => {
    const db = TypeormConnection.connection.manager;

    const newUser = db.create(UserEntity, user);
    await db.save(newUser);

    const res = await request(app)
      .post(`/user/${newUser.id}/tasks`)
      .send({ title: task.title, description: task.description })
      .expect(201);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.message).toEqual("Task criada com sucesso!");
  });

  test("Deveria retornar erro 500 se gerar uma exceção.", async () => {
    jest
      .spyOn(CreateTaskUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado");
      });
    const res = await request(app)
      .post(`/user/:userId/tasks`)
      .send({ title: task.title, description: task.description })
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
    expect(res.ok).toBeFalsy();
  });
});
