import { Redis } from "ioredis";
import { getEnvCred } from "./get-env-cred.js";

const redisUrl = getEnvCred("redisUrl");

export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const defaultQueueName = "Default";
