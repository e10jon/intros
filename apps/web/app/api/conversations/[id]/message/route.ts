import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/types";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/conversations/[id]/message", "POST">>> {
  const json =
    (await request.json()) as Body<"/api/conversations/[id]/message">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const message = await cnt.prisma.message.create({
    data: {
      conversationId: params.id,
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
  });

  return NextResponse.json({ message });
}
