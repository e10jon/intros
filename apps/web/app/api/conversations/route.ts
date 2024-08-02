import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/types";

export async function GET(): Promise<NextResponse<Data<"/api/conversations">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const conversations = await cnt.prisma.conversation.findMany({
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
    },
  });

  return NextResponse.json({ conversations });
}
