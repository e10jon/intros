import { Container } from "@/container";
import { endOfToday, startOfToday } from "date-fns";
import { numTokensPerMonth } from "@intros/types";

export class JobsModule {
  constructor(private cnt: Container) {}

  async addMonthlyTokens() {
    console.log("Creating tokens... ");

    const users = await this.cnt.prisma.user.findMany({
      where: {
        AND: [
          { nextTokenReset: { gte: startOfToday() } },
          { nextTokenReset: { lt: endOfToday() } },
        ],
      },
      select: {
        id: true,
        email: true,
        _count: {
          select: { tokens: { where: { conversationId: null } } },
        },
      },
    });

    for (const user of users) {
      let numTokensToCreate = numTokensPerMonth - user._count.tokens;
      if (numTokensToCreate <= 0) continue;

      await this.cnt.prisma.token.createMany({
        data: [...new Array(numTokensToCreate)].map(() => ({
          userId: user.id,
        })),
      });

      // update clerk

      console.log(`${user.email} ${numTokensToCreate} tokens created`);
    }
  }

  async resetProfilesNumNewIntrosRemaining() {
    // runs every minute on user's dailyIntrosResetTime
  }

  async sendEmails() {
    // runs every minute on user's sendEmailsTime
  }

  async recreateCronJobs() {
    // first, delete all repeatable jobs
    const keys = (await this.cnt.queue.getRepeatableJobs()).map((j) => j.key);
    console.log(`Deleting repeatable jobs: ${keys.join(" | ")}`);
    await Promise.all(keys.map((k) => this.cnt.queue.removeRepeatableByKey(k)));

    // now create them
    await Promise.all([
      this.cnt.addJob("addMonthlyTokens", {
        jobOptions: {
          repeat: { every: 1000 * 60 * 60 * 24 }, // daily
          attempts: 1,
        },
      }),
      this.cnt.addJob("resetProfilesNumNewIntrosRemaining", {
        jobOptions: {
          repeat: { every: 1000 * 60 }, // every minute
          attempts: 1,
        },
      }),
      this.cnt.addJob("sendEmails", {
        jobOptions: {
          repeat: { every: 1000 * 60 }, // every minute
          attempts: 1,
        },
      }),
    ]);
  }
}
