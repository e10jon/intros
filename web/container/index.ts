import { Prisma, PrismaClient } from "@prisma/client";

export class Container {
  private constructor(private request: Request) {}

  static async init(request: Request) {
    const cnt = new Container(request);
    return cnt;
  }

  private prismaExtension = Prisma.defineExtension({
    query: {
      user: {
        async create({ query, args }) {
          const result = await query(args);
          await this.sendEmailToUser(); // can access container methods
          return result;
        },
      },
    },
  });

  prisma = new PrismaClient().$extends(this.prismaExtension);

  sendEmailToUser = async () => {
    console.log("Sending email to user");
  };
}
