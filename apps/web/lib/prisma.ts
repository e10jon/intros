import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

export const selectArgsForMessage = {
  id: true,
  body: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { profile: { select: { id: true } } } },
};
