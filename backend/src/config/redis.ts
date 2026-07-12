import { createClient, RedisClientType } from "redis";
import { envConfig } from ".";

export const RedisClient: RedisClientType = createClient({
  socket: {
    host: envConfig.redis.host,
    port: Number(envConfig.redis.port),
  },
  password: envConfig.redis.password,
});

export const connectRedis = async () => {
  console.log("⏳ Connecting Redis Cache Database...");
  try {
    await RedisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};
