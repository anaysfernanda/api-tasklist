import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { GetTaskUsecase } from "../../../../../src/app/features/task/usecases/get-task.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { TaskEntity } from "../../../../../src/app/shared/database/entities/task.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Get task Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new GetTaskUsecase();
  };

  const user = new User("any_email", "any_password");
  const task = new Task("any_title", "any_description", false);

  test("Deveria retornar 404 se a task não for encontrada.", async () => {
    jest.spyOn(TaskRepository.prototype, "get").mockResolvedValue(0);

    const sut = makeSut();

    const result = await sut.execute(task.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Task não encontrada!");
  });

  test("Deveria retornar 200 se a task for listada sucesso.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(TaskRepository.prototype, "get").mockResolvedValue(task);
    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");

    const sut = makeSut();

    const result = await sut.execute(task.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toEqual("Task listada com sucesso!");
    expect(result).toBeTruthy();
    expect(cacheSpyOn).toHaveBeenCalled();
    expect(cacheSpyOn).toHaveBeenCalledWith(
      `getTask:${task.id}`,
      result.data,
      3600
    );
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });
});
