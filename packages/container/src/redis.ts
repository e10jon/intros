import { Redis } from "ioredis";
import { getEnvCred } from "./get-env-cred.js";
import { Queue } from "bullmq";

const redisUrl = getEnvCred("redisUrl");

export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const defaultQueueName = "Default";

export const createQueue = () => new Queue(defaultQueueName, { connection });
