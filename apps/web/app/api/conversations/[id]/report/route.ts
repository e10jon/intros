import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/shared";
import { selectArgsForMessage } from "@/lib/prisma";

// report the conversation
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/conversations/[id]/report", "POST">>> {
  const json = (await request.json()) as Body<"/api/conversations/[id]/report">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const conversation = await cnt.prisma.conversation.findUniqueOrThrow({
    where: { id: params.id },
  });

  const suspectId =
    conversation.fromUserId === currentPrismaUser.id
      ? conversation.toUserId
      : conversation.fromUserId;

  const suspectProfile = await cnt.prisma.profile.findFirst({
    where: { userId: suspectId },
    select: { id: true },
  });

  // create the message and the report
  const [message, report] = await Promise.all([
    cnt.prisma.message.create({
      data: {
        conversationId: params.id,
        body: "",
        userId: currentPrismaUser.id,
        specialCode: "Reported",
      },
      select: selectArgsForMessage,
    }),
    cnt.prisma.report.create({
      data: {
        strategy: "AI",
        status: "Pending",
        reason: json.reason,
        suspectId,
        reporterId: currentPrismaUser.id,
        conversationId: params.id,
        profileId: suspectProfile?.id,
      },
    }),
    cnt.prisma.conversation.update({
      where: { id: params.id },
      data: { reportedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ message });
}
