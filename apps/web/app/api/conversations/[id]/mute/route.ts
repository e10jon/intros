import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/shared";
import { selectArgsForMessage } from "@/lib/prisma";

// mute the conversation
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/conversations/[id]/mute", "POST">>> {
  const json = (await request.json()) as Body<"/api/conversations/[id]/mute">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  // create the message and mute the conversation
  const [message] = await Promise.all([
    cnt.prisma.message.create({
      data: {
        conversationId: params.id,
        body: "",
        userId: currentPrismaUser.id,
        specialCode: "Muted",
      },
      select: selectArgsForMessage,
    }),
    cnt.prisma.conversation.update({
      where: { id: params.id },
      data: {
        mutedAt: new Date(),
        mutedByUserId: currentPrismaUser.id,
      },
    }),
  ]);

  return NextResponse.json({ message });
}
