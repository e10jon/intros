import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma, User } from "@prisma/client";
import { prisma } from "../prisma";
import { Queue } from "bullmq";
import { defaultQueueName } from "@/bullmq/queue";
import { connection } from "@/bullmq/connection";
import { WebhooksModule } from "./modules/webhooks";
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

  getCurrentPrismaUserOrThrow = async () => {
    const user = await this.currentPrismaUser;
    if (!user) throw new Error("No current prisma user found!");
    return user;
  };

  /** Will use the Stripe API to create a customer and save the ID in Prisma,
   * if the current user does not already have one. Returns the customer ID string. */
  getStripeCustomerId = async () => {
    const user = await this.getCurrentPrismaUserOrThrow();
    if (user.stripeCustomerId) return user.stripeCustomerId;

    const stripeCustomer = await this.stripe.apiClient.customers.create({
      email: user.email || undefined,
    });

    this._currentPrismaUser = prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: stripeCustomer.id },
    });

    return stripeCustomer.id;
  };

  /** Direct access to Prisma client. */
  prisma = prisma.$extends(this.prismaExtension);

  /** Direct access to BullMQ queue. */
  queue = new Queue(defaultQueueName, { connection });

  stripe = new StripeModule(this);
  webhooks = new WebhooksModule(this);

  helloWorld = () => ({ hello: "world" });
}
