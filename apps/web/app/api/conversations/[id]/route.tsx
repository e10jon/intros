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
        user: { select: { profile: { select: { id: true } } } },
      },
    }),
  ]);

  // fetch the profiles of the users in the conversation
  const profileIdsInConversation = Array.from(
    new Set(
      messages.reduce<string[]>((arr, m) => {
        if (m.user.profile) return arr.concat(m.user.profile.id);
        return arr;
      }, [])
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
