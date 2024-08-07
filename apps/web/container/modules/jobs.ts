import { Container } from "@/container";
import { endOfToday } from "date-fns";
import { numTokensPerMonth } from "@intros/shared";
import { inspect } from "@/lib/inspect";

export class JobsModule {
  constructor(private cnt: Container) {}

  async addMonthlyTokens() {
    console.log("Adding monthly tokens... ");

    const users = await this.cnt.prisma.user.findMany({
      where: {
        AND: [
          // get everyone in the past who might have missed a job
          // { nextTokenReset: { gte: startOfToday() } },
          { nextTokenReset: { lt: endOfToday() } },
        ],
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        _count: {
          select: { tokens: { where: { conversationId: null } } },
        },
      },
    });

    for (const user of users) {
      let numTokensToCreate = numTokensPerMonth - user._count.tokens;
      if (numTokensToCreate <= 0) continue;

      await Promise.all([
        this.cnt.prisma.token.createMany({
          data: [...new Array(numTokensToCreate)].map(() => ({
            userId: user.id,
          })),
        }),
        this.cnt.clerk.apiClient.users.updateUserMetadata(user.clerkId, {
          publicMetadata: {
            numAvailableTokens: numTokensPerMonth,
          },
        }),
      ]);

      console.log(`${user.email} ${numTokensToCreate} tokens created`);
    }
  }

  async resetProfilesNumNewIntrosRemaining() {
    // find all users with nextIntrosResetAt < now
    // add the tokens
    // set the user's nextIntrosResetAt to the next time
  }

  async sendEmails() {
    // find all users with nextEmailSendAt < now
    // include their conversation notifications and settings
    // send an email per user
    // set the user's nextEmailSendAt to the next time
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
          repeat: { every: 1000 * 60 * 60 }, // every hour
          attempts: 1,
        },
      }),
    ]);
  }

  async unsuspendUsers() {}

  async sandbox() {
    const response = await this.cnt.ai.reviewUserReport({
      report: { reason: "he is harrassing me" },
      profile: { title: "Senior Art Director", bio: "I am a loving person." },
      messages: [
        { body: "hey" },
        { body: "where are you" },
        { body: "i want to talk to you" },
        { body: "i want to eat you" },
      ],
    });

    inspect(response);
  }
}
