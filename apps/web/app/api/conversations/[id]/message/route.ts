import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Body, Data } from "@intros/types";
import { selectArgsForMessage } from "@/lib/prisma";

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
    select: selectArgsForMessage,
  });

  return NextResponse.json({ message });
}
