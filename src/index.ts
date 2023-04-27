import "reflect-metadata";
import { TypeormConnection } from "./main/database/typeorm.connection";
import { RedisConnection } from "./main/database/redis.connection";
import { Server } from "./main/server/express.server";

Promise.all([TypeormConnection.connect(), RedisConnection.connect()]).then(
  Server.run
);
