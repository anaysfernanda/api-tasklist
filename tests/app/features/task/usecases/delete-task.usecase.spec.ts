import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { DeleteTaskUsecase } from "../../../../../src/app/features/task/usecases/delete-task.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Delete task Usecase", () => {
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
    return new DeleteTaskUsecase();
  };
  const user = new User("any_email", "any_password");
  const task = new Task("any_title", "any_description", false);

  test("Deveria retornar 404 se o usuário não foi encontrado.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      taskId: task.id,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Usuário não encontrado!");
  });

  test("Deveria retornar 404 se a task não for encontrada.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "get").mockResolvedValue(0);

    const sut = makeSut();

    const result = await sut.execute({
      userId: user.id,
      taskId: task.id,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Task não encontrada!");
  });

  test("Deveria retornar 200 se a task for excluída sucesso.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "get").mockResolvedValue(task);
    jest.spyOn(TaskRepository.prototype, "delete").mockResolvedValue(1);

    const sut = makeSut();

    const result = await sut.execute({ taskId: task.id, userId: user.id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toEqual("Task excluída com sucesso!");
    expect(result).toBeTruthy();
  });
});
