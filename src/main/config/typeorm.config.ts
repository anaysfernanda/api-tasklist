import { DataSource } from "typeorm";
import { databaseEnv } from "../../app/envs/database.env";

let entites = "src/app/shared/database/entities/**/*.ts";
let migrations = "src/app/shared/database/migrations/**/*.ts";

if (process.env.NODE_ENV !== "dev") {
  entites = "build/app/shared/database/entities/**/*.js";
  migrations = "build/app/shared/database/migrations/**/*.js";
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
