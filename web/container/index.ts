import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../app/[...auth]";
import { IncomingMessage, Server, ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

type ContainerRequest =
  | NextApiRequest
  | (IncomingMessage & { cookies: NextApiRequestCookies });

type ContainerResponse = NextApiResponse | ServerResponse<IncomingMessage>;

export class Container {
  private constructor(
    private request: ContainerRequest,
    private response: ContainerResponse
  ) {}

  static async init(request: ContainerRequest, response: ContainerResponse) {
    const cnt = new Container(request, response);
    cnt.session = await getServerSession(request, response, authOptions);

    console.log("user", cnt.session.user);
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
