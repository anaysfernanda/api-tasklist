import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { GetUserUsecase } from "../../../../../src/app/features/user/usecases/get-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("Get User Usecase", () => {
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
    return new GetUserUsecase();
  };

  const user = new User("any_email", "any_password");

  test("Deveria retornar 404 se o usuário não for encontrado.", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Usuário não encontrado!");
  });

  test("Deveria retornar 200 se o usuário for criado com sucesso. ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    const sut = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toEqual("Usuário obtido com sucesso!");
    expect(result).toBeTruthy();
    expect(result).toHaveProperty("data");
    expect(result.data.id).toHaveLength(36);
  });
});
