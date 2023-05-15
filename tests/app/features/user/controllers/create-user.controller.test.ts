import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";

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

const user = {
  email: "any_e-mail",
  password: "any_password",
};

describe("Create user controller tests", () => {
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
    await RedisConnection.connection.del(`userList`);
  });

  const app = createApp();

  const checkFieldNotProvided = (res: any, field: string) => {
    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty("body.message", `${field} não fornecido(a).`);
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeFalsy();
  };

  test("Deveria retornar status 400 se o e-mail não for informado", async () => {
    const res = await request(app)
      .post("/user")
      .send({ email: "", password: "" });
    checkFieldNotProvided(res, "E-mail");
  });

  test("Deveria retornar status 400 se a senha não for informado", async () => {
    const res = await request(app)
      .post("/user")
      .send({ email: user.email, password: "" });
    checkFieldNotProvided(res, "Senha");
  });

  test("Deveria retornar status 400 se a senha tiver menos que 6 caractéres", async () => {
    const res = await request(app)
      .post("/user")
      .send({ email: user.email, password: "123" });
    checkFieldNotProvided(res, "Senha");
  });

  test("Deveria retornar status 400 se o usuário já existir.", async () => {
    const user = await makeUser();

    const res = await request(app)
      .post("/user")
      .send({ nome: user.email, password: user.password });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 400);
    expect(res).toHaveProperty("body.message", "Usuário já existe!");
  });

  test("Deveria retornar status 201 se o usuário for criado.", async () => {
    const res = await request(app)
      .post("/user")
      .send({ email: user.email, password: user.password })
      .expect(201);

    expect(res).toBeDefined();
    expect(res).toHaveProperty("ok");
    expect(res.ok).toBeTruthy();
    expect(res.body.message).toEqual("Usuário criado com sucesso!");
  });

  test("Deveria retornar status 500 se gerar exceção. ", async () => {
    jest
      .spyOn(CreateUserUsecase.prototype, "execute")
      .mockImplementation((_) => {
        throw new Error("Erro simulado");
      });
    const res = await request(app)
      .post("/user")
      .send({ email: user.email, password: user.password })
      .expect(500);

    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
  });
});
