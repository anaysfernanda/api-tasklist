import { UserController } from "../../../../../src/app/features/user/controller/user.controller";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { ListUserUsecase } from "../../../../../src/app/features/user/usecases/list-user.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

const makeUsers = async () => {
  const db = TypeormConnection.connection.manager;

  const userOne = db.create(UserEntity, new User("email_one", "password_one"));
  const userTwo = db.create(UserEntity, new User("email_two", "password_two"));

  await db.save(userOne);
  await db.save(userTwo);

  const user1 = UserRepository.mapEntityToModel(userOne as UserEntity);
  const user2 = UserRepository.mapEntityToModel(userTwo as UserEntity);

  return [user1, user2];
};

describe("List user controller tests", () => {
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
    await TypeormConnection.connection.manager.delete(UserEntity, {});
  });

  const app = createApp();

  test("Deveria retornar status 200 e uma lista de usuários.", async () => {
    await makeUsers();
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    const cacheSpyOn = jest.spyOn(CacheRepository.prototype, "setEx");

    const res = await request(app).get("/user").send().expect(200);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.data).toHaveLength(2);
    expect(res.body.message).toEqual("Usuários listados com sucesso!");
    expect(cacheSpyOn).toHaveBeenCalledWith("userList", res.body.data, 3600);
    expect(cacheSpyOn).toHaveBeenCalledTimes(1);
  });

  test("Deveria retornar status 500 quando gerar exceção.", async () => {
    jest.spyOn(ListUserUsecase.prototype, "execute").mockImplementation(() => {
      throw new Error("Erro simulado");
    });

    const res = await request(app).get("/user").send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual("Error: Erro simulado");
  });
});
