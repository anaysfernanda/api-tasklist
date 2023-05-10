import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { ListUserUsecase } from "../../../../../src/app/features/user/usecases/list-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Create User Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new ListUserUsecase();
  };

  const user = new User("any_email", "any_password");

  test("Deveria retornar status 200 e uma lista de usuarios.", async () => {
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

    jest
      .spyOn(UserRepository.prototype, "list")
      .mockResolvedValue([user, user]);

    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");
    const sut = makeSut();

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Usuários listados com sucesso!");
    expect(result).toBeTruthy();
    expect(result.data).toHaveLength(2);
    expect(cacheSpyOn).toHaveBeenCalled();
    expect(cacheSpyOn).toHaveBeenCalledWith("userList", result.data, 3600);
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });
});
