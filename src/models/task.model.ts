import { v4 as createUuid } from "uuid";

export class Task {
  private _id: string;
  constructor(private _title: string, private _description: string) {
    this._id = createUuid();
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public set title(detail: string) {
    this._title = detail;
  }

  public get description() {
    return this._description;
  }

  public set description(description: string) {
    this._description = description;
  }

  public toJson() {
    return {
      id: this._id,
      detail: this._title,
      description: this._description,
    };
  }
}
