import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/types";
import { selectArgsForMessage } from "@/lib/prisma";

// create a new message in a conversation
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/conversations/[id]/message", "POST">>> {
  const json =
    (await request.json()) as Body<"/api/conversations/[id]/message">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const conversation = await cnt.prisma.conversation.findUniqueOrThrow({
    where: { id: params.id },
  });
  const recipientUserId =
    conversation.fromUserId === currentPrismaUser.id
      ? conversation.toUserId
      : conversation.fromUserId;

  const [message, notification] = await Promise.all([
    cnt.prisma.message.create({
      data: {
        conversationId: params.id,
        body: json.body,
        userId: currentPrismaUser.id,
      },
      select: selectArgsForMessage,
    }),
    // create a notification for the recipient
    cnt.prisma.conversationNotification.upsert({
      where: {
        userId_conversationId: {
          userId: recipientUserId,
          conversationId: conversation.id,
        },
      },
      update: {
        seenAt: null,
        numUnreadMessages: { increment: 1 },
      },
      create: {
        userId: recipientUserId,
        conversationId: conversation.id,
        numUnreadMessages: 1,
      },
    }),
  ]);

  return NextResponse.json({ message });
}
