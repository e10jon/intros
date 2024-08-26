import { createQueue } from "./redis.js";
import { prismaExtended } from "./prisma-extended.js";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import type { AuthObject } from "@clerk/remix/api.server";

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
}
