import { User } from "../../../models/user.model";
import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { UserEntity } from "../../../shared/database/entities/user.entity";

export class UserRepository {
  private repository = TypeormConnection.connection.getRepository(UserEntity);

  public async create(user: User) {
    const userEntity = this.repository.create({
      id: user.id,
      email: user.email,
      password: user.password,
    });

    const result = await this.repository.save(userEntity);
    return UserRepository.mapEntityToModel(result);
  }

  public async list(): Promise<User[]> {
    const result = await this.repository.find();

    return result.map((user: any) => UserRepository.mapEntityToModel(user));
  }

  public static mapEntityToModel(entity: UserEntity): User {
    return User.create(entity.id, entity.email, entity.password);
  }

  public async get(id: string) {
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      return null;
    }

    return UserRepository.mapEntityToModel(result);
  }

  public async getByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOneBy({
      email,
    });
    if (!result) {
      return null;
    }

    return UserRepository.mapEntityToModel(result);
  }

  public async login(user: any): Promise<any> {
    const result = await this.repository.findOne({
      where: {
        email: user.email,
        password: user.password,
      },
    });

    return result;
  }
}
