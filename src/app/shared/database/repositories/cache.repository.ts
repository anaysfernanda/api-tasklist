import Redis from "ioredis";
import { RedisConnection } from "../../../../main/database/redis.connection";

export class CacheRepository {
  private repository: Redis = RedisConnection.connection;

  public async get(key: string): Promise<any> {
    const result = await this.repository.get(key);

    if (!result) {
      return null;
    }

    return JSON.parse(result);
  }
  public async delete(key: string) {
    await this.repository.del(key);
  }

  public async set(key: string, value: any): Promise<any> {
    await this.repository.set(key, JSON.stringify(value));
  }
}
