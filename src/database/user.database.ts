import { User } from "../models/user.model";
import { users } from "./users";

export class UserDataBase {
  public create(user: User) {
    return users.push(user);
  }

  public list() {
    return [...users];
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
