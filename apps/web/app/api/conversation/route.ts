import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/types";

export async function POST(
  request: Request
): Promise<NextResponse<Data<"/api/conversation", "POST">>> {
  const json = (await request.json()) as Body<"/api/conversation">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const conversation = await cnt.prisma.$transaction(async (tx) => {
    const token = await cnt.prisma.token.findFirst({
      where: { conversationId: null, userId: currentPrismaUser.id },
    });
    if (!token) throw new Error("No tokens available");

    return await tx.conversation.create({
      data: {
        fromUserId: currentPrismaUser.id,
        toUserId: json.toUserId,
        token: { connect: { id: token.id } },
      },
    });
  });

  const [messages, profiles, _] = await Promise.all([
    [
      await cnt.prisma.message.create({
        data: {
          conversationId: conversation.id,
          body: json.body,
          userId: currentPrismaUser.id,
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { profile: { select: { id: true } } } },
        },
      }),
    ],
    cnt.prisma.profile.findMany({
      where: {
        id: {
          in: [currentPrismaUser.id, json.toUserId],
        },
      },
    }),
    cnt.clerk.syncMetadata({
      prismaUserId: currentPrismaUser.id,
      clerkUserId: currentPrismaUser.clerkId,
    }),
  ]);

  return NextResponse.json({ conversation, messages, profiles });
}
