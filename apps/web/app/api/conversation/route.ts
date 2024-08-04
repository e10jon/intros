import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/types";
import { selectArgsForMessage } from "@/lib/prisma";

// create a new conversation
export async function POST(
  request: Request
): Promise<NextResponse<Data<"/api/conversation", "POST">>> {
  const json = (await request.json()) as Body<"/api/conversation">;

  const cnt = await Container.init();
  const clerkUser = await cnt.getCurrentClerkUserOrThrow();
  const prismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const conversation = await cnt.prisma.$transaction(async (tx) => {
    const token = await tx.token.findFirst({
      where: { conversationId: null, userId: prismaUser.id },
    });
    if (!token) throw new Error("No tokens available");

    // make sure the profile has intros remaining
    const { numNewIntrosRemaining } = await tx.profile.findUniqueOrThrow({
      where: { userId: json.toUserId },
      select: { numNewIntrosRemaining: true },
    });

    if (numNewIntrosRemaining <= 0) {
      throw new Error("No intros remaining for profile");
    }

    const conversation = await tx.conversation.create({
      data: {
        fromUserId: prismaUser.id,
        toUserId: json.toUserId,
        token: { connect: { id: token.id } },
      },
    });

    // decrement the profile's intros remaining
    await tx.profile.update({
      where: { userId: json.toUserId },
      data: { numNewIntrosRemaining: { decrement: 1 } },
    });

    return conversation;
  });

  const [messages, profiles, _, notification] = await Promise.all([
    [
      await cnt.prisma.message.create({
        data: {
          conversationId: conversation.id,
          body: json.body,
          userId: prismaUser.id,
        },
        select: selectArgsForMessage,
      }),
    ],
    cnt.prisma.profile.findMany({
      where: {
        id: {
          in: [prismaUser.id, json.toUserId],
        },
      },
    }),
    // sync with clerk to update token availability
    cnt.clerk.syncWithClerk({
      prismaUser,
      clerkUser,
    }),
    // create a notification for the recipient
    cnt.prisma.conversationNotification.upsert({
      where: {
        userId_conversationId: {
          userId: json.toUserId,
          conversationId: conversation.id,
        },
      },
      update: {
        seenAt: null,
        numUnreadMessages: { increment: 1 },
      },
      create: {
        userId: json.toUserId,
        conversationId: conversation.id,
        numUnreadMessages: 1,
      },
    }),
  ]);

  return NextResponse.json({ conversation, messages, profiles });
}
