import { createQueue } from "./redis.js";
import { prismaExtended } from "./prisma-extended.js";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import type { AuthObject } from "@clerk/remix/api.server";
import type { User } from "@prisma/client";

export class Container {
  private constructor(
    private loaderFunctionArgs?: LoaderFunctionArgs,
    private authObject?: AuthObject
  ) {}

  static async init(loaderFunctionArgs: LoaderFunctionArgs) {
    const authObject = await getAuth(loaderFunctionArgs);
    const cnt = new Container(loaderFunctionArgs, authObject);
    return cnt;
  }

  prisma = prismaExtended.call(this);
  queue = createQueue();

  private _currentUser?: Promise<User | null>;

  get getCurrentUser() {
    if (typeof this._currentUser === "undefined") {
      this._currentUser =
        !this.authObject || !this.authObject.userId
          ? Promise.resolve(null)
          : this.prisma.user.findUnique({
              where: { clerkId: this.authObject.userId },
            });
    }
    return this._currentUser;
  }

  getCurrentUserOrThrow = async () => {
    const user = await this.getCurrentUser;
    if (!user) throw new Error("No current user found!");
    return user;
  };
}
