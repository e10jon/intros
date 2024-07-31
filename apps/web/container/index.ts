import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Queue } from "bullmq";
import { defaultQueueName } from "@/bullmq/queue";
import { connection } from "@/bullmq/connection";
import Stripe from "stripe";
import { getEnvCred } from "@/get-env-cred";
import { WebhooksModule } from "./modules/webhooks";

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

  getCurrentPrismaUser = async () => {
    const user = await this.currentUser;
    if (!user) return null;
    return await prisma.user.findUnique({ where: { id: user.id } });
  };

  getCurrentPrismaUserOrThrow = async () => {
    const user = await this.getCurrentPrismaUser();
    if (!user) throw new Error("No current user found!");
    return user;
  };

  /** Direct access to Prisma client. */
  prisma = prisma.$extends(this.prismaExtension);

  /** Direct access to BullMQ queue. */
  queue = new Queue(defaultQueueName, { connection });

  /** Direct access to Stripe API client. */
  stripe = new Stripe(getEnvCred("stripeSecretKey"));

  webhooks = new WebhooksModule(this);

  helloWorld = () => ({ hello: "world" });
}
