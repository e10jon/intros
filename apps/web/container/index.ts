import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JobsOptions, Queue } from "bullmq";
import { defaultQueueName } from "@/bullmq/queue";
import { connection } from "@/bullmq/connection";
import { ClerkModule } from "./modules/clerk";
import { StripeModule } from "./modules/stripe";

export class Container {
  private constructor() {}

  static async init() {
    const cnt = new Container();
    return cnt;
  }

  private prismaExtension = Prisma.defineExtension({
    query: {
      token: {
        async createMany({ query, args }) {
          const res = await query(args);

          // TODO: count the args by userId and update clerk with the new number
          const userIds = Array.isArray(args.data)
            ? args.data.map((d) => d.userId)
            : [args.data.userId];
          const userIdsGroup = userIds.reduce<{ [userId: string]: number }>(
            (obj, userId) => {
              obj[userId] = (obj[userId] || 0) + 1;
              return obj;
            },
            {}
          );

          return res;
        },
      },
    },
  });

  /** Run any function on the container asynchronously. */
  addJob = async <
    K extends keyof Container,
    A extends Container[K] extends (...args: infer B) => unknown
      ? B | [...B, { jobOptions: JobsOptions }]
      : never
  >(
    fn: K,
    ...args: A
  ) => {
    // if the last arg is { jobOptions: ... }, pick it off and provide it as job options to the job
    const lastArg = args[args.length - 1];
    const jobOptions = argHasJobOptions(lastArg)
      ? lastArg.jobOptions
      : undefined;

    const job = await this.queue.add(fn, { args, fn }, jobOptions);
    console.log(`Added job: ${fn}`, { args, jobOptions });
    return job;
  };

  private _currentAuth?: ReturnType<typeof auth>;
  private _currentClerkUser?: Promise<ClerkUser | null>;
  protected _currentPrismaUser?: Promise<User | null>;

  /** The currently auth'd object. */
  get currentAuth() {
    if (typeof this._currentAuth === "undefined") {
      this._currentAuth = auth();
    }
    return this._currentAuth;
  }

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
}

const argHasJobOptions = (arg: unknown): arg is { jobOptions: JobsOptions } => {
  return !!(arg && typeof arg === "object" && "jobOptions" in arg);
};
