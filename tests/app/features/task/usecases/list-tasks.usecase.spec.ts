import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { ListTasksUsecase } from "../../../../../src/app/features/task/usecases/list-tasks.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Task } from "../../../../../src/app/models/task.model";
import { TaskRepository } from "../../../../../src/app/features/task/database/task.repository";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("List tasks Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
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
    return new ListTasksUsecase();
  };

  const user = new User("any_email", "any_password");
  const task = new Task("any_title", "any_description", false);

  test("Deveria retornar 404 se o usuário não foi encontrado.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute("any_id", task.archived);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Usuário não encontrado!");
  });

  test("Deveria retornar status 200 e uma lista de tasks.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest
      .spyOn(TaskRepository.prototype, "list")
      .mockResolvedValue([task, task]);

    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");
    const sut = makeSut();

    const result = await sut.execute("any_id", task.archived);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Tasks listadas com sucesso!");
    expect(result).toBeTruthy();
    expect(result.data).toHaveLength(2);
    expect(cacheSpyOn).toHaveBeenCalled();
    expect(cacheSpyOn).toHaveBeenCalledWith(
      `listaTasks:${"any_id"}-${task.archived}`,
      result.data,
      3600
    );
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });
});
