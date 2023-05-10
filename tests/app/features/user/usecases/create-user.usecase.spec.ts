import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("Create User Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterEach(async () => {
    await RedisConnection.connection.del("userList");
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
    return new CreateUserUsecase();
  };

  const user = {
    id: "any_id",
    email: "any_email",
    password: "any_password",
  };

  test("Deveria retornar 400 se o usuário já existir.", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(new User(user.email, user.password));

    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty("message", "Usuário já existe!");
  });

  test("Deveria retornar 201 se o usuário for criado com sucesso. ", async () => {
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null);

    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(new User(user.email, user.password));

    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result.message).toEqual("Usuário criado com sucesso!");
    expect(result).toBeTruthy();
    expect(result).toHaveProperty("data");
    expect(result.data.id).toHaveLength(36);
  });
});
