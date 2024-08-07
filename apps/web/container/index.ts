import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { Prisma, Profile, User, UserSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JobsOptions, Queue } from "bullmq";
import { defaultQueueName } from "@/bullmq/queue";
import { connection } from "@/bullmq/connection";
import { ClerkModule, JobsModule, AiModule, StripeModule } from "./modules";
import {
  addMonths,
  addWeeks,
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  startOfTomorrow,
} from "date-fns";
import {
  profileInterestsArrayToString,
  profileInterestsStringToArray,
} from "@/lib/profile-interests";

export class Container {
  private constructor() {}

  static async init(opts?: { requireAdmin?: boolean; requireUser?: boolean }) {
    const cnt = new Container();

    if (opts?.requireAdmin)
      await cnt.getCurrentClerkUserOrThrow({ requireAdmin: true });
    else if (opts?.requireUser) await cnt.getCurrentClerkUserOrThrow();

    return cnt;
  }

  private prismaExtension = Prisma.defineExtension({
    result: {
      profile: {
        interestsArray: {
          needs: { interests: true },
          compute({ interests }) {
            return profileInterestsStringToArray(interests);
          },
        },
      },
    },
    model: {
      profile: {
        interestsArrayToString(interestsArray?: string[]) {
          return profileInterestsArrayToString(interestsArray);
        },
      },
      user: {
        calculateNextIntrosResetAt(settings: {
          dailyIntrosResetTime: NonNullable<
            UserSettings["dailyIntrosResetTime"]
          >;
        }) {
          const date = startOfTomorrow();
          date.setTime(settings.dailyIntrosResetTime.getTime());
          return date;
        },
        calculateNextEmailSendAt(settings: {
          emailFrequency: NonNullable<UserSettings["emailFrequency"]>;
          sendEmailsDayOfWeek: NonNullable<UserSettings["sendEmailsDayOfWeek"]>;
          sendEmailsTime: NonNullable<UserSettings["sendEmailsTime"]>;
        }) {
          const date = (() => {
            if (settings.emailFrequency === "Daily") {
              return startOfTomorrow();
            }
            if (
              settings.emailFrequency === "Weekly" ||
              settings.emailFrequency === "Monthly"
            ) {
              const startDate =
                settings.emailFrequency === "Weekly"
                  ? addWeeks(new Date(), 1)
                  : addMonths(new Date(), 1);

              if (settings.sendEmailsDayOfWeek === "Sunday")
                return nextSunday(startDate);
              if (settings.sendEmailsDayOfWeek === "Monday")
                return nextMonday(startDate);
              if (settings.sendEmailsDayOfWeek === "Tuesday")
                return nextTuesday(startDate);
              if (settings.sendEmailsDayOfWeek === "Wednesday")
                return nextWednesday(startDate);
              if (settings.sendEmailsDayOfWeek === "Thursday")
                return nextThursday(startDate);
              if (settings.sendEmailsDayOfWeek === "Friday")
                return nextFriday(startDate);
              if (settings.sendEmailsDayOfWeek === "Saturday")
                return nextSaturday(startDate);
            }

            throw new Error(
              `Invalid EmailFrequency ${settings.emailFrequency}`
            );
          })();

          date.setTime(settings.sendEmailsTime.getTime());

          return date;
        },
      },
    },
  });

  /** Run any function on the container asynchronously. */
  addJob = async <
    K extends keyof Container["jobs"],
    A extends Container["jobs"][K] extends (...args: infer B) => unknown
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

  getCurrentClerkUserOrThrow = async (opts?: { requireAdmin?: boolean }) => {
    const user = await this.currentClerkUser;
    if (!user) throw new Error("No current clerk user found!");
    if (opts?.requireAdmin && !user.publicMetadata.isAdmin)
      throw new Error("User is not an admin");
    return user;
  };

  getCurrentPrismaUserOrThrow = async (opts?: { requireAdmin?: boolean }) => {
    const user = await this.currentPrismaUser;
    if (!user) throw new Error("No current prisma user found!");
    if (opts?.requireAdmin && !user.isAdmin)
      throw new Error("User is not an admin!");
    return user;
  };

  /** Direct access to Prisma client. */
  prisma = prisma.$extends(this.prismaExtension);

  /** Direct access to BullMQ queue. */
  queue = new Queue(defaultQueueName, { connection });

  stripe = new StripeModule(this);
  clerk = new ClerkModule(this);
  jobs = new JobsModule(this);
  ai = new AiModule(this);
}

const argHasJobOptions = (arg: unknown): arg is { jobOptions: JobsOptions } => {
  return !!(arg && typeof arg === "object" && "jobOptions" in arg);
};
