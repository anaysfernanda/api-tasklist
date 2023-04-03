import { User } from "../../models/user.model";
import { DatabaseConnection } from "../config/database.connection";
import { UserEntity } from "../entities/user.entity";
import { users } from "../users";

export class UserDataBase {
  private repository = DatabaseConnection.connection.getRepository(UserEntity);

  public async create(user: User) {
    const userEntity = this.repository.create({
      id: user.id,
      email: user.email,
      password: user.password,
    });

    const result = await this.repository.save(userEntity);
    return this.mapEntityToModel(result);
  }

  public async list(): Promise<User[]> {
    const result = await this.repository.find();

    return result.map((user: any) => this.mapEntityToModel(user));
  }

  private mapEntityToModel(entity: UserEntity): User {
    return User.create(entity.id, entity.email, entity.password);
  }

  public login(email: string, password: string) {
    return users.find(
      (user) => user.email === email && user.password === password
    );
  }

  public getById(id: string) {
    return users.find((user) => {
      return user.id === id;
    });
  }

  public getIndex(id: string) {
    return users.findIndex((user) => user.id === id);
  }
}
