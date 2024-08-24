import { createQueue } from "./redis.js";
import { prismaExtended } from "./prisma-extended.js";

export class Container {
  prisma = prismaExtended.call(this);
  queue = createQueue();
}
