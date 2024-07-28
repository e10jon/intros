import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../app/[...auth]";

export class Container {
  private constructor() {}

  static async init() {
    const cnt = new Container();
    cnt.session = await getServerSession(authOptions);
    console.log("user", cnt.session?.user);
    return cnt;
  }

  private prismaExtension = Prisma.defineExtension({
    query: {
      user: {
        async create({ query, args }) {
          return query(args);
        },
      },
    },
  });

  private session?: Session;

  prisma = new PrismaClient().$extends(this.prismaExtension);

  sendEmailToUser = async () => {
    console.log("Sending email to user");
  };

  helloWorld = () => ({ hello: "world" });
}
