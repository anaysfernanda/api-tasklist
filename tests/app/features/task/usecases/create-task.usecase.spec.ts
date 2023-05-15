import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { CreateTaskUsecase } from "../../../../../src/app/features/task/usecases/create-task.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Create task Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await RedisConnection.connection.del(`getTask:${user.id}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${true}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${false}`);
    await RedisConnection.connection.del(`listaTasks:${user.id}-${undefined}`);
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  const makeSut = () => {
    return new CreateTaskUsecase();
  };

  const user = new User("any_email", "any_password");
  const task = new Task("any_title", "any_description", false);

  test("Deveria retornar 404 se o usuário não foi encontrado.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Usuário não encontrado!");
  });

  test("Deveria retornar 201 se a task for criada com sucesso.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "create").mockResolvedValue(task);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result.message).toEqual("Task criada com sucesso!");
    expect(result).toBeTruthy();
    expect(result).toHaveProperty("data");
  });
});
