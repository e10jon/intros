import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export class Container {
  private constructor() {}

  static async init() {
    const cnt = new Container();
    cnt.currentAuth = auth();
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

  /** The currently auth'd object. */
  currentAuth?: ReturnType<typeof auth>;

  private _currentUser?: Promise<ClerkUser | null>;

  /** A promise that returns the authenticated user. */
  get currentUser() {
    if (typeof this._currentUser === "undefined") {
      this._currentUser = currentUser();
    }
    return this._currentUser;
  }

  /** Direct access to prisma client. */
  prisma = prisma.$extends(this.prismaExtension);

  sendEmailToUser = async () => {
    console.log("Sending email to user");
  };

  helloWorld = () => ({ hello: "world" });
}
