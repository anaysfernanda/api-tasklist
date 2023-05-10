import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("Create User Usecase", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new LoginUsecase();
  };

  const user = new User("any_email", "any_password");

  test("Deveria retornar 401 se o usuário não for autorizado.", async () => {
    jest.spyOn(UserRepository.prototype, "login").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 401);
    expect(result).toHaveProperty("message", "Usuário não autorizado.");
  });

  test("Deveria retornar 200 se o usuário for logado com sucesso. ", async () => {
    jest.spyOn(UserRepository.prototype, "login").mockResolvedValue(user);
    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toEqual("Login feito com sucesso!");
    expect(result).toBeTruthy();
    expect(result).toHaveProperty("data");
    expect(result.data.id).toHaveLength(36);
  });
});
