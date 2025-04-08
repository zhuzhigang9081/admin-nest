import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
@Injectable()
export class CacheService {
    //@Inject() 指定要注入的依赖
    constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) { }

    //获取值
    async get(key) {
        let value = await this.redisClient.get(key);
        try {
            value = JSON.parse(value);
        } catch (error) { }
        return value;
    }
    /**
     * 设置值
     * @param key {string} key
     * @param value 值
     * @param second 过期时间 秒
     * @returns Promise<any>
     */
    async set(key: string, value: any, second?: number) {
        value = JSON.stringify(value);
        return await this.redisClient.set(key, value, { EX: second });
    }
    //删除值
    async del(key: string) {
        return await this.redisClient.del(key);
    }
    //清除缓存
    async flushall() {
        return await this.redisClient.flushAll();
    }
}
