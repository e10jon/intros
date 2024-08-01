import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma, User } from "@prisma/client";
import { prisma } from "../prisma";
import { Queue } from "bullmq";
import { defaultQueueName } from "@/bullmq/queue";
import { connection } from "@/bullmq/connection";
import { ClerkModule } from "./modules/clerk";
import { StripeModule } from "./modules/stripe";

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

  private _currentClerkUser?: Promise<ClerkUser | null>;
  protected _currentPrismaUser?: Promise<User | null>;

  /** A promise that returns the authenticated user. */
  get currentClerkUser() {
    if (typeof this._currentClerkUser === "undefined") {
      this._currentClerkUser = currentUser();
    }
    return this._currentClerkUser;
  }

  get currentPrismaUser() {
    if (typeof this._currentPrismaUser === "undefined") {
      this._currentPrismaUser = this.currentClerkUser.then(
        (currentClerkUser) => {
          if (!currentClerkUser)
            throw new Error("No current clerk user found!");
          return prisma.user.findUnique({
            where: { clerkId: currentClerkUser.id },
          });
        }
      );
    }

    return this._currentPrismaUser;
  }

  async updateCurrentPrismaUser(data: Prisma.UserUpdateInput) {
    const currentClerkUser = await this.getCurrentClerkUserOrThrow();
    this._currentPrismaUser = this.prisma.user.update({
      where: { clerkId: currentClerkUser.id },
      data,
    });
    return await this._currentPrismaUser;
  }

  getCurrentClerkUserOrThrow = async () => {
    const user = await this.currentClerkUser;
    if (!user) throw new Error("No current clerk user found!");
    return user;
  };

  getCurrentPrismaUserOrThrow = async () => {
    const user = await this.currentPrismaUser;
    if (!user) throw new Error("No current prisma user found!");
    return user;
  };

  /** Direct access to Prisma client. */
  prisma = prisma.$extends(this.prismaExtension);

  /** Direct access to BullMQ queue. */
  queue = new Queue(defaultQueueName, { connection });

  stripe = new StripeModule(this);
  clerk = new ClerkModule(this);

  helloWorld = () => ({ hello: "world" });
}
