import { User } from "../../../models/user.model";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";

interface CreateUserParams {
  id: string;
  email: string;
  password: string;
}

export class CreateUserUsecase {
  public async execute(data: CreateUserParams): Promise<Return> {
    const repository = new UserRepository();
    const email = await repository.getByEmail(data.email);

    if (email !== null) {
      return {
        ok: false,
        code: 400,
        message: "Usuário já existe!",
      };
    }

    const user = new User(data.email, data.password);
    const result = await repository.create(user);

    return {
      ok: true,
      code: 201,
      message: "Usuário criado com sucesso!",
      data: result.toJson(),
    };
  }
}
