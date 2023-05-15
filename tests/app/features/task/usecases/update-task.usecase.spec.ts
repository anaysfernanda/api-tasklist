import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { UpdateTaskUsecase } from "../../../../../src/app/features/task/usecases/update-task.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Update task Usecase", () => {
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
    return new UpdateTaskUsecase();
  };
  const user = new User("any_email", "any_password");
  const task = new Task("any_title", "any_description", false);

  test("Deveria retornar 404 se o usuário não foi encontrado.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      taskId: task.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Usuário não encontrado!");
  });

  test("Deveria retornar 404 se a task não for encontrada.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "update").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      taskId: task.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Task não encontrada!");
  });

  test("Deveria retornar 200 se a task for editada sucesso.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "update").mockResolvedValue(task);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      taskId: task.id,
      title: task.title,
      description: task.description,
      archived: task.archived,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toEqual("Task editada com sucesso!");
    expect(result).toBeTruthy();
  });
});
