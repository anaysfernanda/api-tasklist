import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
dotenv.config();

let entites = "src/database/entities/**/*.ts";
let migrations = "src/database/migrations/**/*.ts";

if (process.env.NODE_ENV !== "dev") {
  entites = "build/database/entities/**/*.js";
  migrations = "build/database/migrations/**/*.js";
}

export default new DataSource({
  type: "postgres",
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: [entites],
  migrations: [migrations],
  schema: "tasklist",
});
