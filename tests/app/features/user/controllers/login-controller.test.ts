import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login-user.usecase";
import { LoginValidator } from "../../../../../src/app/features/user/validators/login-user.validator";
import { User } from "../../../../../src/app/models/user.model";

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

const newUser = {
  email: "any_e-mail",
  password: "any_password",
};

describe("Login user controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection.manager.delete(UserEntity, {});
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
    const res = await request(app).post("/user/login").send({});
    checkFieldNotProvided(res, "E-mail");
  });

  test("Deveria retornar status 400 se a senha não for informado", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: newUser.email });
    checkFieldNotProvided(res, "Senha");
  });

  test("Deveria retornar status 401 se o usuário não for autorizado.", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: newUser.email, password: newUser.password });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode", 401);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message", "Usuário não autorizado.");
  });

  test("Deveria retornar status 200 se o usuário fizer login com sucesso. ", async () => {
    const user = await makeUser();
    const res = await request(app)
      .post("/user/login")
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res).toBeDefined();
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("message", "Login feito com sucesso!");
  });

  test("Deveria retornar status 500 quando gerar exceção.", async () => {
    jest
      .spyOn(LoginUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado");
      });

    const res = await request(app)
      .post("/user/login")
      .send({ email: newUser.email, password: newUser.password });

    expect(res).toBeDefined();
    expect(res).toHaveProperty("statusCode");
    expect(res.statusCode).toBe(500);
    expect(res).toHaveProperty("body.message", "Error: Erro simulado");
  });
});
