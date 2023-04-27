import { DataSource } from "typeorm";
import { databaseEnv } from "../../app/envs/database.env";

let entites = "src/database/entities/**/*.ts";
let migrations = "src/database/migrations/**/*.ts";

if (process.env.NODE_ENV !== "dev") {
  entites = "build/database/entities/**/*.js";
  migrations = "build/database/migrations/**/*.js";
}

export default new DataSource({
  type: "postgres",
  host: databaseEnv.host,
  username: databaseEnv.username,
  password: databaseEnv.password,
  database: databaseEnv.database,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [entites],
  migrations: [migrations],
  schema: "tasklist",
});
