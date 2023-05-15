import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { GetUserUsecase } from "../../../../../src/app/features/user/usecases/get-user.usecase";
import { User } from "../../../../../src/app/models/user.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

const makeUser = async () => {
  const db = TypeormConnection.connection.manager;
  const newUser = new User("any_email", "any_password");

  const userEntity = db.create(UserEntity, {
    id: newUser.id,
    email: newUser.email,
    password: newUser.password,
  });

  await db.save(userEntity);

  const user = UserRepository.mapEntityToModel(userEntity as UserEntity);

  return user;
};

describe("List user controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection.manager.delete(UserEntity, {});
  });

  const app = createApp();

  test("Deveria retornar status 404 se o usuário não for encontrado.", async () => {
    const res = await request(app).get("/user/:userId").send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 404);
    expect(res).toHaveProperty("body.message", "Usuário não encontrado!");
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  });

  test("Deveria retornar status 200 e um usuário.", async () => {
    const user = await makeUser();
    const res = await request(app).get(`/user/${user.id}`).send().expect(200);

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
    expect(res.body.message).toEqual("Usuário obtido com sucesso!");
  });

  test("Deveria retornar status 500 quando gerar exceção.", async () => {
    jest.spyOn(GetUserUsecase.prototype, "execute").mockImplementation(() => {
      throw new Error("Erro simulado");
    });

    const res = await request(app).get("/user/:userId").send();

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual("Error: Erro simulado");
  });
});
