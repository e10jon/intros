import { Container } from "@/container";
import { endOfToday, startOfToday } from "date-fns";
import { numTokensPerMonth } from "@/lib/constants";

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

      console.log(`${user.email} ${numTokensToCreate} tokens created`);
    }
  }

  async resetProfilesNumNewIntrosRemaining() {
    // runs every minute on user's dailyIntrosResetTime
  }

  async sendEmails() {
    // runs every minute on user's sendEmailsTime
  }
}
