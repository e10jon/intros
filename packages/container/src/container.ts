import { Queue } from "bullmq";
import { connection, defaultQueueName } from "./redis.js";
import { prismaExtended } from "./prisma-extended.js";

export class Container {
  prisma = prismaExtended.call(this);
  queue = new Queue(defaultQueueName, { connection });
}
