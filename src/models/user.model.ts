import { v4 as creatUuid } from "uuid";
import { Task } from "./task.model";

export class User {
  private _id: string;
  private _tasks: Task[];

  constructor(private _email: string, private _password: string) {
    this._id = creatUuid();
    this._tasks = [];
  }

  public get tasks() {
    return this._tasks;
  }

  public set tasks(tasks: Task[]) {
    this._tasks = tasks;
  }

  public addTask(task: Task) {
    this.tasks.push(task);
  }

  public get id() {
    return this._id;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get password() {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }

  public toJson() {
    return {
      id: this._id,
      email: this._email,
      password: this._password,
    };
  }

  public static create(
    id: string,
    email: string,
    password: string,
    task?: Task[]
  ) {
    const user = new User(email, password);
    user._id = id;

    return user;
  }
}
