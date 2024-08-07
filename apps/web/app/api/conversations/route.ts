import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data, Body } from "@intros/shared";

export async function GET(): Promise<NextResponse<Data<"/api/conversations">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const [conversations, numTokensAvailable] = await Promise.all([
    cnt.prisma.conversation
      .findMany({
        where: {
          OR: [
            { fromUserId: currentPrismaUser.id },
            { toUserId: currentPrismaUser.id },
          ],
        },
        include: {
          userFrom: {
            select: { profile: true },
          },
          userTo: {
            select: { profile: true },
          },
          notifications: {
            where: { userId: currentPrismaUser.id },
          },
        },
      })
      .then((conversations) =>
        conversations.map(({ userFrom, userTo, ...conversation }) => {
          const userFromProfile = userFrom.profile
            ? {
                ...userFrom.profile,
                interests: userFrom.profile.interestsArray,
              }
            : userFrom.profile;

          const userToProfile = userTo.profile
            ? {
                ...userTo.profile,
                interests: userTo.profile.interestsArray,
              }
            : userTo.profile;

          return {
            ...conversation,
            userFrom: { profile: userFromProfile },
            userTo: { profile: userToProfile },
          };
        })
      ),
    cnt.prisma.token.count({
      where: { userId: currentPrismaUser.id, conversationId: null },
    }),
  ]);

  return NextResponse.json({ conversations, numTokensAvailable });
}
