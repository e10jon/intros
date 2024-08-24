import type { Container } from "./container.js";
import { prisma } from "./prisma.js";

export function prismaExtended(this: Container) {
  return prisma.$extends((a) => a);
}
