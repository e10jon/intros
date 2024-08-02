import { Container } from "@/container";
import { numTokensPerMonth } from "@/lib/constants";

export default async (cnt: Container) => {
  console.log("Creating tokens... ");

  const users = await cnt.prisma.user.findMany({
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
    if (numTokensPerMonth <= 0) continue;

    await cnt.prisma.token.createMany({
      data: [...new Array(numTokensToCreate)].map(() => ({
        userId: user.id,
      })),
    });

    console.log(`${user.email} ${numTokensToCreate} tokens created`);
  }
};
