import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/conversations/[id]">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  // fetch the conversation and its messages
  const [conversation, messages] = await Promise.all([
    cnt.prisma.conversation.findUniqueOrThrow({
      where: {
        id: params.id,
        // Ensure the current user is part of the conversation
        OR: [
          { fromUserId: currentPrismaUser.id },
          { toUserId: currentPrismaUser.id },
        ],
      },
    }),
    cnt.prisma.message.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        userFrom: { select: { profile: { select: { id: true } } } },
        userTo: { select: { profile: { select: { id: true } } } },
      },
    }),
  ]);

  // fetch the profiles of the users in the conversation
  const profileIdsInConversation = Array.from(
    new Set(
      messages.flatMap((m) => {
        const profileIds = [];
        if (m.userFrom.profile?.id) profileIds.push(m.userFrom.profile.id);
        if (m.userTo.profile?.id) profileIds.push(m.userTo.profile.id);
        return profileIds;
      })
    )
  );
  const profiles = await cnt.prisma.profile.findMany({
    where: {
      userId: {
        in: profileIdsInConversation,
      },
    },
  });

  return NextResponse.json({ conversation, messages, profiles });
}
