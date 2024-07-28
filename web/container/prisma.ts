import { Prisma, PrismaClient } from "@prisma/client";

const extension = Prisma.defineExtension({
  query: {
    user: {
      async create({ query, args }) {
        console.log("Creating a user");
        return query(args);
      },
    },
  },
});

const client = new PrismaClient().$extends(extension);
