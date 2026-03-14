import Redis from "ioredis";
import { env } from "./env.js";

let redisClient = null;

export function createRedisClient() {
  if (redisClient) return redisClient;

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true
  });

  redisClient.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redisClient.on("error", (error) => {
    console.error("Redis connection error:", error.message);
  });

  return redisClient;
}

export async function connectRedis() {
  try {
    const client = createRedisClient();

    if (client.status !== "ready") {
      await client.connect();
    }

    return client;
  } catch (error) {
    console.error("Failed to connect Redis:", error.message);
    throw error;
  }
}

export function getRedisClient() {
  return createRedisClient();
}
