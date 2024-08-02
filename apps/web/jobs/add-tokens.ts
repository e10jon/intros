import { Container } from "@/container";
import { inspect } from "@/lib/inspect";

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
    let numTokensCreated = 0;

    for (let i = user._count.tokens; i < 5; i++) {
      await cnt.prisma.token.create({ data: { userId: user.id } });
      numTokensCreated++;
    }

    console.log(`${user.email} ${numTokensCreated} tokens created`);
  }
};
