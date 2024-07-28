import { Prisma } from "@prisma/client";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { prisma } from "../prisma";

export class Container {
  private constructor() {}

  static async init() {
    const cnt = new Container();
    cnt.session = await getServerSession(authOptions);
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

  public session?: Session;

  prisma = prisma.$extends(this.prismaExtension);

  sendEmailToUser = async () => {
    console.log("Sending email to user");
  };

  helloWorld = () => ({ hello: "world" });
}
